package user

import (
	"craft/internal/db"
	"craft/internal/model"

	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
	"github.com/supabase-community/supabase-go"
)

type FormHandler struct {
	supabase *supabase.Client
	DB       *db.Database
}

func NewFormHandler(supabase *supabase.Client, DB *db.Database) *FormHandler {
	return &FormHandler{
		supabase: supabase,
		DB:       DB,
	}
}

type CreateFormRequest struct {
	Title       string  `json:"title" validate:"required"`
	Description *string `json:"description"`
}

func (h *FormHandler) CreateForm(c fiber.Ctx) error {
	ctx := c.Context()
	userIDRaw := c.Locals("user_id")
	if userIDRaw == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "User not authenticated",
		})
	}

	userID := userIDRaw.(uuid.UUID)

	var req CreateFormRequest
	if err := c.Bind().JSON(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	if req.Title == "" {
		req.Title = "Untitled Form"
	}

	var f model.Form
	err := h.DB.Pool.QueryRow(ctx, `
		INSERT INTO forms (owner_id, title, description, status, is_public, allow_multiple_submissions)
		VALUES ($1, $2, $3, 'draft', false, false)
		RETURNING id, owner_id, title, description, status, is_public, allow_multiple_submissions, close_date, thank_you_message, redirect_url, created_at, updated_at
	`, userID, req.Title, req.Description).Scan(
		&f.ID, &f.OwnerID, &f.Title, &f.Description, &f.Status,
		&f.IsPublic, &f.AllowMultipleSubmissions, &f.CloseDate,
		&f.ThankYouMessage, &f.RedirectURL, &f.CreatedAt, &f.UpdatedAt,
	)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error":  "Failed to create form",
			"detail": err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(f)
}

func (h *FormHandler) GetForm(c fiber.Ctx) error {
	ctx := c.Context()
	userIDRaw := c.Locals("user_id")
	if userIDRaw == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "User not authenticated",
		})
	}

	userID := userIDRaw.(uuid.UUID)
	formIDStr := c.Params("id")
	formID, err := uuid.Parse(formIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid form ID",
		})
	}

	var f model.Form
	err = h.DB.Pool.QueryRow(ctx, `
		SELECT id, owner_id, title, description, status, is_public, allow_multiple_submissions, close_date, thank_you_message, redirect_url, created_at, updated_at
		FROM forms
		WHERE id = $1 AND owner_id = $2
	`, formID, userID).Scan(
		&f.ID, &f.OwnerID, &f.Title, &f.Description, &f.Status,
		&f.IsPublic, &f.AllowMultipleSubmissions, &f.CloseDate,
		&f.ThankYouMessage, &f.RedirectURL, &f.CreatedAt, &f.UpdatedAt,
	)

	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Form not found",
		})
	}

	rows, err := h.DB.Pool.Query(ctx, `
		SELECT id, form_id, type, title, description, emoji, position, required
		FROM questions
		WHERE form_id = $1
		ORDER BY position ASC
	`, formID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch questions",
		})
	}
	defer rows.Close()

	var questions []model.Question
	questionIDs := []uuid.UUID{}
	for rows.Next() {
		var q model.Question
		if err := rows.Scan(&q.ID, &q.FormID, &q.Type, &q.Title, &q.Description, &q.Emoji, &q.Position, &q.Required); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to scan question",
			})
		}
		questions = append(questions, q)
		questionIDs = append(questionIDs, q.ID)
	}

	if len(questionIDs) > 0 {
		optRows, err := h.DB.Pool.Query(ctx, `
			SELECT id, question_id, label, position
			FROM question_options
			WHERE question_id = ANY($1)
			ORDER BY question_id, position ASC
		`, questionIDs)
		if err == nil {
			defer optRows.Close()
			optionsMap := make(map[uuid.UUID][]model.Option)
			for optRows.Next() {
				var opt model.Option
				if err := optRows.Scan(&opt.ID, &opt.QuestionID, &opt.Label, &opt.Position); err == nil {
					optionsMap[opt.QuestionID] = append(optionsMap[opt.QuestionID], opt)
				}
			}

			for i := range questions {
				if opts, ok := optionsMap[questions[i].ID]; ok {
					questions[i].Options = opts
				}
			}
		}
	}

	f.Questions = questions
	return c.JSON(f)
}

func (h *FormHandler) UpdateForm(c fiber.Ctx) error {
	ctx := c.Context()
	userIDRaw := c.Locals("user_id")
	if userIDRaw == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "User not authenticated",
		})
	}

	userID := userIDRaw.(uuid.UUID)
	formIDStr := c.Params("id")
	formID, err := uuid.Parse(formIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid form ID",
		})
	}

	var req model.Form
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

	_, err = tx.Exec(ctx, `
		UPDATE forms 
		SET title = $1, description = $2, updated_at = NOW()
		WHERE id = $3 AND owner_id = $4
	`, req.Title, req.Description, formID, userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update form metadata",
		})
	}

	_, err = tx.Exec(ctx, `DELETE FROM questions WHERE form_id = $1`, formID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to clear existing questions",
		})
	}

	for i, q := range req.Questions {
		if q.ID == uuid.Nil {
			q.ID = uuid.New()
		}

		_, err = tx.Exec(ctx, `
			INSERT INTO questions (id, form_id, type, title, description, emoji, position, required)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		`, q.ID, formID, q.Type, q.Title, q.Description, q.Emoji, i, q.Required)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error":  "Failed to insert question",
				"detail": err.Error(),
			})
		}

		for j, opt := range q.Options {
			if opt.ID == uuid.Nil {
				opt.ID = uuid.New()
			}
			_, err = tx.Exec(ctx, `
				INSERT INTO question_options (id, question_id, label, position)
				VALUES ($1, $2, $3, $4)
			`, opt.ID, q.ID, opt.Label, j)
			if err != nil {
				return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
					"error":  "Failed to insert option",
					"detail": err.Error(),
				})
			}
		}
	}

	if err := tx.Commit(ctx); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to commit transaction",
		})
	}

	return c.SendStatus(fiber.StatusNoContent)
}

func (h *FormHandler) DuplicateForm(c fiber.Ctx) error {
	ctx := c.Context()
	userIDRaw := c.Locals("user_id")
	if userIDRaw == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "User not authenticated",
		})
	}

	userID := userIDRaw.(uuid.UUID)
	formIDStr := c.Params("id")
	formID, err := uuid.Parse(formIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid form ID",
		})
	}

	// Start transaction
	tx, err := h.DB.Pool.Begin(ctx)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to start transaction",
		})
	}
	defer tx.Rollback(ctx)

	var originalForm model.Form
	err = tx.QueryRow(ctx, `
		SELECT title, description
		FROM forms
		WHERE id = $1 AND owner_id = $2
	`, formID, userID).Scan(&originalForm.Title, &originalForm.Description)

	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Form not found",
		})
	}

	var newForm model.Form
	err = tx.QueryRow(ctx, `
		INSERT INTO forms (owner_id, title, description, status, is_public, allow_multiple_submissions)
		VALUES ($1, $2, $3, 'draft', false, false)
		RETURNING id, owner_id, title, description, status, is_public, allow_multiple_submissions, close_date, thank_you_message, redirect_url, created_at, updated_at
	`, userID, "Copy of "+originalForm.Title, originalForm.Description).Scan(
		&newForm.ID, &newForm.OwnerID, &newForm.Title, &newForm.Description, &newForm.Status,
		&newForm.IsPublic, &newForm.AllowMultipleSubmissions, &newForm.CloseDate,
		&newForm.ThankYouMessage, &newForm.RedirectURL, &newForm.CreatedAt, &newForm.UpdatedAt,
	)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create new form",
		})
	}

	rows, err := tx.Query(ctx, `
		SELECT id, type, title, description, emoji, position, required
		FROM questions
		WHERE form_id = $1
	`, formID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch questions",
		})
	}
	defer rows.Close()

	var questions []model.Question
	for rows.Next() {
		var q model.Question
		if err := rows.Scan(&q.ID, &q.Type, &q.Title, &q.Description, &q.Emoji, &q.Position, &q.Required); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to scan question",
			})
		}
		questions = append(questions, q)
	}
	rows.Close()

	for _, q := range questions {
		newQuestionID := uuid.New()
		_, err = tx.Exec(ctx, `
			INSERT INTO questions (id, form_id, type, title, description, emoji, position, required)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		`, newQuestionID, newForm.ID, q.Type, q.Title, q.Description, q.Emoji, q.Position, q.Required)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to copy question",
			})
		}

		_, err = tx.Exec(ctx, `
			INSERT INTO question_options (id, question_id, label, position)
			SELECT gen_random_uuid(), $1, label, position
			FROM question_options
			WHERE question_id = $2
		`, newQuestionID, q.ID)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to copy options",
			})
		}
	}

	if err := tx.Commit(ctx); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to commit transaction",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(newForm)
}

func (h *FormHandler) PublishForm(c fiber.Ctx) error {
	ctx := c.Context()
	userIDRaw := c.Locals("user_id")
	if userIDRaw == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "User not authenticated",
		})
	}

	userID := userIDRaw.(uuid.UUID)
	formIDStr := c.Params("id")
	formID, err := uuid.Parse(formIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid form ID",
		})
	}

	_, err = h.DB.Pool.Exec(ctx, `
		UPDATE forms
		SET status = 'published', is_public = true, updated_at = NOW()
		WHERE id = $1 AND owner_id = $2
	`, formID, userID)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to publish form",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Form published successfully",
	})
}

func (h *FormHandler) UnpublishForm(c fiber.Ctx) error {
	ctx := c.Context()
	userIDRaw := c.Locals("user_id")
	if userIDRaw == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "User not authenticated",
		})
	}

	userID := userIDRaw.(uuid.UUID)
	formIDStr := c.Params("id")
	formID, err := uuid.Parse(formIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid form ID",
		})
	}

	_, err = h.DB.Pool.Exec(ctx, `
		UPDATE forms
		SET status = 'draft', is_public = false, updated_at = NOW()
		WHERE id = $1 AND owner_id = $2
	`, formID, userID)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to unpublish form",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Form unpublished successfully",
	})
}

func (h *FormHandler) GetPublicForm(c fiber.Ctx) error {
	ctx := c.Context()
	username := c.Params("username")
	slug := c.Params("slug") //title of form
	var f model.Form

	// replace spaces with underscores
	err := h.DB.Pool.QueryRow(ctx, `
		SELECT f.id, f.owner_id, f.title, f.description, f.status, f.is_public, 
		       f.allow_multiple_submissions, f.close_date, f.thank_you_message, f.redirect_url, 
		       f.created_at, f.updated_at
		FROM forms f
		JOIN users u ON f.owner_id = u.id
		WHERE LOWER(REPLACE(TRIM(u.first_name), ' ', '_')) = LOWER($1) 
		  AND LOWER(REPLACE(TRIM(f.title), ' ', '_')) = LOWER($2)
		  AND f.status = 'published' AND f.is_public = true
		LIMIT 1
	`, username, slug).Scan(
		&f.ID, &f.OwnerID, &f.Title, &f.Description, &f.Status,
		&f.IsPublic, &f.AllowMultipleSubmissions, &f.CloseDate,
		&f.ThankYouMessage, &f.RedirectURL, &f.CreatedAt, &f.UpdatedAt,
	)

	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Form not found or not public",
		})
	}

	rows, err := h.DB.Pool.Query(ctx, `
		SELECT id, form_id, type, title, description, emoji, position, required
		FROM questions
		WHERE form_id = $1
		ORDER BY position ASC
	`, f.ID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch questions",
		})
	}
	defer rows.Close()

	var questions []model.Question
	questionIDs := []uuid.UUID{}
	for rows.Next() {
		var q model.Question
		if err := rows.Scan(&q.ID, &q.FormID, &q.Type, &q.Title, &q.Description, &q.Emoji, &q.Position, &q.Required); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to scan question",
			})
		}
		questions = append(questions, q)
		questionIDs = append(questionIDs, q.ID)
	}

	if len(questionIDs) > 0 {
		optRows, err := h.DB.Pool.Query(ctx, `
			SELECT id, question_id, label, position
			FROM question_options
			WHERE question_id = ANY($1)
			ORDER BY question_id, position ASC
		`, questionIDs)
		if err == nil {
			defer optRows.Close()
			optionsMap := make(map[uuid.UUID][]model.Option)
			for optRows.Next() {
				var opt model.Option
				if err := optRows.Scan(&opt.ID, &opt.QuestionID, &opt.Label, &opt.Position); err == nil {
					optionsMap[opt.QuestionID] = append(optionsMap[opt.QuestionID], opt)
				}
			}

			for i := range questions {
				if opts, ok := optionsMap[questions[i].ID]; ok {
					questions[i].Options = opts
				}
			}
		}
	}

	f.Questions = questions
	return c.JSON(f)
}

func (h *FormHandler) DeleteForm(c fiber.Ctx) error {
	ctx := c.Context()
	userIDRaw := c.Locals("user_id")
	if userIDRaw == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "User not authenticated",
		})
	}

	userID := userIDRaw.(uuid.UUID)
	formIDStr := c.Params("id")
	formID, err := uuid.Parse(formIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid form ID",
		})
	}

	res, err := h.DB.Pool.Exec(ctx, `
		DELETE FROM forms 
		WHERE id = $1 AND owner_id = $2
	`, formID, userID)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error":  "Failed to delete form",
			"detail": err.Error(),
		})
	}

	if res.RowsAffected() == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Form not found or you don't have permission to delete it",
		})
	}

	return c.SendStatus(fiber.StatusNoContent)
}
