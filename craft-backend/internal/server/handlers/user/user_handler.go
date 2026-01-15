package user

import (
	"craft/internal/db"
	"craft/internal/model"

	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
	"github.com/supabase-community/supabase-go"
)

type UserHandler struct {
	supabase *supabase.Client
	DB       *db.Database
}

func NewUserHandler(supabase *supabase.Client, DB *db.Database) *UserHandler {
	return &UserHandler{
		supabase: supabase,
		DB:       DB,
	}
}

func (h *UserHandler) GetDashboardData(c fiber.Ctx) error {
	ctx := c.Context()
	userIDRaw := c.Locals("user_id")
	if userIDRaw == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "User not authenticated",
		})
	}

	userID := userIDRaw.(uuid.UUID)

	rows, err := h.DB.Pool.Query(ctx, `
		SELECT f.id, f.owner_id, f.title, f.description, f.status, f.is_public, 
		       f.allow_multiple_submissions, f.close_date, f.thank_you_message, f.redirect_url, 
		       f.created_at, f.updated_at,
		       (SELECT COUNT(*) FROM submissions s WHERE s.form_id = f.id) as response_count
		FROM forms f
		WHERE f.owner_id = $1
		ORDER BY f.updated_at DESC
	`, userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error":  "Failed to retrieve forms",
			"detail": err.Error(),
		})
	}
	defer rows.Close()

	var forms []model.Form
	for rows.Next() {
		var f model.Form
		err := rows.Scan(
			&f.ID, &f.OwnerID, &f.Title, &f.Description, &f.Status,
			&f.IsPublic, &f.AllowMultipleSubmissions, &f.CloseDate,
			&f.ThankYouMessage, &f.RedirectURL, &f.CreatedAt, &f.UpdatedAt,
			&f.Responses,
		)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error":  "Failed to scan form data",
				"detail": err.Error(),
			})
		}
		forms = append(forms, f)
	}

	totalForms := len(forms)
	activeForms := 0
	draftForms := 0
	for _, f := range forms {
		if f.Status == "published" {
			activeForms++
		} else if f.Status == "draft" {
			draftForms++
		}
	}

	var totalResponses int
	err = h.DB.Pool.QueryRow(ctx, `
		SELECT COUNT(*) 
		FROM submissions s
		JOIN forms f ON f.id = s.form_id
		WHERE f.owner_id = $1
	`, userID).Scan(&totalResponses)
	if err != nil {
		totalResponses = 0
	}

	return c.JSON(fiber.Map{
		"forms": forms,
		"stats": fiber.Map{
			"total_forms":     totalForms,
			"active_forms":    activeForms,
			"draft_forms":     draftForms,
			"total_responses": totalResponses,
		},
	})
}
