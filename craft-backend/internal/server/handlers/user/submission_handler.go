package user

import (
	"craft/internal/db"
	"encoding/json"
	"fmt"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
	"github.com/supabase-community/supabase-go"
)

type SubmissionHandler struct {
	supabase *supabase.Client
	DB       *db.Database
}

func NewSubmissionHandler(supabase *supabase.Client, DB *db.Database) *SubmissionHandler {
	return &SubmissionHandler{
		supabase: supabase,
		DB:       DB,
	}
}

func (h *SubmissionHandler) SubmitForm(c fiber.Ctx) error {
	ctx := c.Context()
	formIDStr := c.Params("id")
	formID, err := uuid.Parse(formIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid form ID",
		})
	}

	var req struct {
		Answers []struct {
			QuestionID uuid.UUID   `json:"question_id"`
			Value      interface{} `json:"value"`
		} `json:"answers"`
	}

	if err := c.Bind().JSON(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	tx, err := h.DB.Pool.Begin(ctx)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to start transaction",
		})
	}
	defer tx.Rollback(ctx)

	submissionID := uuid.New()
	ip := c.IP()
	ua := c.Get("User-Agent")

	_, err = tx.Exec(ctx, `
		INSERT INTO submissions (id, form_id, ip_address, user_agent)
		VALUES ($1, $2, $3, $4)
	`, submissionID, formID, ip, ua)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error":  "Failed to create submission",
			"detail": err.Error(),
		})
	}

	for _, ans := range req.Answers {
		answerID := uuid.New()
		valJSON, err := json.Marshal(ans.Value)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error":  "Failed to marshal answer value",
				"detail": err.Error(),
			})
		}

		_, err = tx.Exec(ctx, `
			INSERT INTO answers (id, submission_id, question_id, value)
			VALUES ($1, $2, $3, $4)
		`, answerID, submissionID, ans.QuestionID, valJSON)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error":  "Failed to save answer",
				"detail": err.Error(),
			})
		}
	}

	if err := tx.Commit(ctx); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error":  "Failed to commit transaction",
			"detail": err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Submission received successfully",
		"id":      submissionID,
	})
}

func (h *SubmissionHandler) GetFormSubmissions(c fiber.Ctx) error {
	ctx := c.Context()
	formIDStr := c.Params("id")
	formID, err := uuid.Parse(formIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid form ID",
		})
	}

	fmt.Printf("DEBUG: Fetching submissions for formID: %s\n", formID)

	subRows, err := h.DB.Pool.Query(ctx, `
		SELECT id, form_id, respondent_email, respondent_user_id, ip_address::text, user_agent, created_at
		FROM submissions
		WHERE form_id = $1
		ORDER BY created_at DESC
	`, formID)
	if err != nil {
		fmt.Printf("DEBUG: Error fetching submissions: %v\n", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch submissions",
		})
	}
	defer subRows.Close()

	var result []map[string]interface{}
	var submissionIDs []uuid.UUID

	for subRows.Next() {
		var s struct {
			ID               uuid.UUID  `json:"id"`
			FormID           uuid.UUID  `json:"form_id"`
			RespondentEmail  *string    `json:"respondent_email"`
			RespondentUserID *uuid.UUID `json:"respondent_user_id"`
			IPAddress        *string    `json:"ip_address"`
			UserAgent        *string    `json:"user_agent"`
			CreatedAt        time.Time  `json:"created_at"`
		}
		if err := subRows.Scan(&s.ID, &s.FormID, &s.RespondentEmail, &s.RespondentUserID, &s.IPAddress, &s.UserAgent, &s.CreatedAt); err != nil {
			fmt.Printf("DEBUG: Error scanning submission: %v\n", err)
			continue
		}
		submissionIDs = append(submissionIDs, s.ID)
		result = append(result, map[string]interface{}{
			"id":                 s.ID,
			"form_id":            s.FormID,
			"respondent_email":   s.RespondentEmail,
			"respondent_user_id": s.RespondentUserID,
			"ip_address":         s.IPAddress,
			"user_agent":         s.UserAgent,
			"created_at":         s.CreatedAt,
			"answers":            []interface{}{},
		})
	}
	subRows.Close()

	fmt.Printf("DEBUG: Found %d submissions\n", len(submissionIDs))

	if len(submissionIDs) == 0 {
		return c.JSON(result)
	}

	ansRows, err := h.DB.Pool.Query(ctx, `
		SELECT id, submission_id, question_id, value, created_at
		FROM answers
		WHERE submission_id = ANY($1)
	`, submissionIDs)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch answers",
		})
	}
	defer ansRows.Close()

	answersMap := make(map[uuid.UUID][]map[string]interface{})
	for ansRows.Next() {
		var a struct {
			ID           uuid.UUID       `json:"id"`
			SubmissionID uuid.UUID       `json:"submission_id"`
			QuestionID   uuid.UUID       `json:"question_id"`
			Value        json.RawMessage `json:"value"`
			CreatedAt    time.Time       `json:"created_at"`
		}
		if err := ansRows.Scan(&a.ID, &a.SubmissionID, &a.QuestionID, &a.Value, &a.CreatedAt); err != nil {
			continue
		}

		var val interface{}
		_ = json.Unmarshal(a.Value, &val)

		answersMap[a.SubmissionID] = append(answersMap[a.SubmissionID], map[string]interface{}{
			"id":          a.ID,
			"question_id": a.QuestionID,
			"value":       val,
			"created_at":  a.CreatedAt,
		})
	}

	for i, sub := range result {
		sID := sub["id"].(uuid.UUID)
		if ans, ok := answersMap[sID]; ok {
			result[i]["answers"] = ans
		}
	}

	return c.JSON(result)
}
