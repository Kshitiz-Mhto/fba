package admin

import (
	"craft/internal/db"
	"craft/internal/model"

	"github.com/gofiber/fiber/v3"
	"github.com/supabase-community/supabase-go"
)

type AdminHandler struct {
	supabase *supabase.Client
	DB       *db.Database
}

func NewAdminHandler(supabase *supabase.Client, DB *db.Database) *AdminHandler {
	return &AdminHandler{
		supabase: supabase,
		DB:       DB,
	}
}

func (h *AdminHandler) GetAllUsers(c fiber.Ctx) error {
	ctx := c.Context()

	rows, err := h.DB.Pool.Query(ctx, `
		SELECT id, first_name, last_name, email, role, is_verified, created_at, updated_at 
		FROM public.users
		ORDER BY created_at DESC
	`)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to retrieve users",
		})
	}
	defer rows.Close()

	var users []model.User
	for rows.Next() {
		var u model.User
		err := rows.Scan(
			&u.ID, &u.FirstName, &u.LastName, &u.Email, &u.Role, &u.IsVerified, &u.CreatedAt, &u.UpdatedAt,
		)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to scan user data",
			})
		}
		users = append(users, u)
	}

	return c.JSON(fiber.Map{
		"users": users,
	})
}

func (h *AdminHandler) GetAllForms(c fiber.Ctx) error {
	ctx := c.Context()

	rows, err := h.DB.Pool.Query(ctx, `
		SELECT id, owner_id, title, description, status, created_at, updated_at 
		FROM forms
		ORDER BY created_at DESC
	`)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to retrieve forms",
		})
	}
	defer rows.Close()

	var forms []model.Form
	for rows.Next() {
		var f model.Form
		err := rows.Scan(
			&f.ID, &f.OwnerID, &f.Title, &f.Description, &f.Status, &f.CreatedAt, &f.UpdatedAt,
		)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to scan form data",
			})
		}
		forms = append(forms, f)
	}

	return c.JSON(fiber.Map{
		"forms": forms,
	})
}

func (h *AdminHandler) GetUserForms(c fiber.Ctx) error {
	ctx := c.Context()
	userID := c.Params("id")

	if userID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "User ID is required",
		})
	}

	rows, err := h.DB.Pool.Query(ctx, `
		SELECT id, owner_id, title, description, status, created_at, updated_at 
		FROM forms
		WHERE owner_id = $1
		ORDER BY created_at DESC
	`, userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to retrieve user forms",
		})
	}
	defer rows.Close()

	var forms []model.Form
	for rows.Next() {
		var f model.Form
		err := rows.Scan(
			&f.ID, &f.OwnerID, &f.Title, &f.Description, &f.Status, &f.CreatedAt, &f.UpdatedAt,
		)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to scan form data",
			})
		}
		forms = append(forms, f)
	}

	return c.JSON(fiber.Map{
		"user_id": userID,
		"forms":   forms,
	})
}

func (h *AdminHandler) DeleteUser(c fiber.Ctx) error {
	ctx := c.Context()
	userID := c.Params("id")

	if userID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "User ID is required",
		})
	}

	_, err := h.DB.Pool.Exec(ctx, `DELETE FROM public.users WHERE id = $1`, userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error":  "Failed to delete user from database",
			"detail": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"message": "User deleted successfully",
		"user_id": userID,
	})
}

func (h *AdminHandler) GetAllUsersWithForms(c fiber.Ctx) error {
	ctx := c.Context()

	rows, err := h.DB.Pool.Query(ctx, `
		SELECT id, first_name, last_name, email, role, is_verified, created_at, updated_at 
		FROM public.users
		ORDER BY created_at DESC
	`)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to retrieve users",
		})
	}
	defer rows.Close()

	var users []model.UserWithForms
	for rows.Next() {
		var u model.UserWithForms
		err := rows.Scan(
			&u.ID, &u.FirstName, &u.LastName, &u.Email, &u.Role, &u.IsVerified, &u.CreatedAt, &u.UpdatedAt,
		)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to scan user data",
			})
		}
		u.Forms = []model.Form{}
		users = append(users, u)
	}

	formRows, err := h.DB.Pool.Query(ctx, `
		SELECT id, owner_id, title, description, status, created_at, updated_at 
		FROM forms
		ORDER BY created_at DESC
	`)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to retrieve forms",
		})
	}
	defer formRows.Close()

	userMap := make(map[string]*model.UserWithForms)
	for i := range users {
		userMap[users[i].ID.String()] = &users[i]
	}

	for formRows.Next() {
		var f model.Form
		err := formRows.Scan(
			&f.ID, &f.OwnerID, &f.Title, &f.Description, &f.Status, &f.CreatedAt, &f.UpdatedAt,
		)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to scan form data",
			})
		}

		if u, ok := userMap[f.OwnerID.String()]; ok {
			u.Forms = append(u.Forms, f)
		}
	}

	return c.JSON(fiber.Map{
		"users": users,
	})
}

func (h *AdminHandler) DeleteForm(c fiber.Ctx) error {
	ctx := c.Context()
	formID := c.Params("id")

	if formID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Form ID is required",
		})
	}

	_, err := h.DB.Pool.Exec(ctx, `DELETE FROM forms WHERE id = $1`, formID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error":  "Failed to delete form from database",
			"detail": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"message": "Form deleted successfully",
		"form_id": formID,
	})
}

func (h *AdminHandler) GetPublishedFormsCount(c fiber.Ctx) error {
	ctx := c.Context()

	var count int
	err := h.DB.Pool.QueryRow(ctx, `
		SELECT COUNT(*) 
		FROM forms 
		WHERE status = 'published'
	`).Scan(&count)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to count published forms",
		})
	}

	return c.JSON(fiber.Map{
		"count": count,
	})
}
