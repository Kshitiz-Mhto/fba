package auth

import (
	"craft/internal/db"
	"craft/internal/model/payload"
	"craft/pkg"
	"strings"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v3"
	"github.com/supabase-community/gotrue-go/types"
	"github.com/supabase-community/supabase-go"
)

type AuthHandler struct {
	Supabase *supabase.Client
	DB       *db.Database
}

func NewAuthHandler(supabase *supabase.Client, database *db.Database) *AuthHandler {
	return &AuthHandler{
		Supabase: supabase,
		DB:       database,
	}
}

// EmailSignupHandler creates a new user account and sends confirmation email
// User is created in DB but marked as unconfirmed until they verify email
func (h *AuthHandler) EmailSignupHandler(c fiber.Ctx) error {
	var req payload.EmailSignupRequest
	if err := c.Bind().JSON(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request",
		})
	}

	if err := pkg.Validator.Struct(req); err != nil {
		errors := err.(validator.ValidationErrors)
		return c.Status(fiber.StatusBadRequest).JSON(errors)
	}
	resp, err := h.Supabase.Auth.Signup(types.SignupRequest{
		Email:    req.Email,
		Password: req.Password,
		Data: map[string]interface{}{
			"first_name": req.FirstName,
			"last_name":  req.LastName,
			"role":       req.Role,
		},
	})

	if err != nil {
		errMsg := strings.ToLower(err.Error())
		if strings.Contains(errMsg, "already registered") ||
			strings.Contains(errMsg, "already exists") ||
			strings.Contains(errMsg, "duplicate") {
			return c.Status(fiber.StatusConflict).JSON(fiber.Map{
				"error": "An account with this email already exists. Please login instead.",
			})
		}

		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error":  "Failed to create account. Try again or contact support.",
			"detail": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"message": "Check your email for a confirmation link to complete signup",
		"user": fiber.Map{
			"id":    resp.User.ID,
			"email": resp.User.Email,
		},
	})
}

func (h *AuthHandler) CompleteEmailVerificationHandler(c fiber.Ctx) error {
	authHeader := c.Get("Authorization")
	if authHeader == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Missing authorization header",
		})
	}

	token := strings.TrimPrefix(authHeader, "Bearer ")
	if token == authHeader { // No "Bearer " prefix was found
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid authorization header format",
		})
	}

	authClient := h.Supabase.Auth.WithToken(token)
	user, err := authClient.GetUser()
	if err != nil || user == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid or expired token",
		})
	}

	if user.EmailConfirmedAt.IsZero() {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Email has not been verified yet. Please click the link from your email.",
		})
	}

	result, err := h.DB.Pool.Exec(c.Context(),
		`UPDATE public.users 
         SET is_verified = true, updated_at = now() 
         WHERE id = $1 AND is_verified = false`,
		user.ID,
	)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error":  "Failed to update verification status",
			"detail": err.Error(),
		})
	}

	rowsAffected := result.RowsAffected()
	message := "Email verification completed successfully"
	if rowsAffected == 0 {

		var exists bool
		err = h.DB.Pool.QueryRow(c.Context(),
			"SELECT EXISTS(SELECT 1 FROM public.users WHERE id = $1)", user.ID,
		).Scan(&exists)

		if err != nil || !exists {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": "User profile not found",
			})
		}

		message = "Email already verified"
	}

	return c.JSON(fiber.Map{
		"message": message,
		"user": fiber.Map{
			"id":          user.ID,
			"email":       user.Email,
			"is_verified": true,
		},
	})
}

func (h *AuthHandler) EmailLoginHandler(c fiber.Ctx) error {
	var req payload.EmailLoginRequest
	if err := c.Bind().JSON(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid credentials",
		})
	}

	if err := pkg.Validator.Struct(req); err != nil {
		errors := err.(validator.ValidationErrors)
		return c.Status(fiber.StatusBadRequest).JSON(errors)
	}

	resp, err := h.Supabase.Auth.SignInWithEmailPassword(req.Email, req.Password)

	if err != nil || resp == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid email or password",
		})
	}

	if resp.User.EmailConfirmedAt.IsZero() {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"error": "Please verify your email first",
		})
	}

	// fetching role from db
	role := "user"
	err = h.DB.Pool.QueryRow(c.Context(), "SELECT role FROM public.users WHERE id = $1", resp.User.ID).Scan(&role)
	if err != nil {
		if r, ok := resp.User.UserMetadata["role"].(string); ok {
			role = r
		}
	}

	return c.JSON(fiber.Map{
		"access_token":  resp.AccessToken,
		"refresh_token": resp.RefreshToken,
		"expires_in":    resp.ExpiresIn,
		"user": fiber.Map{
			"id":         resp.User.ID,
			"email":      resp.User.Email,
			"first_name": resp.User.UserMetadata["first_name"],
			"last_name":  resp.User.UserMetadata["last_name"],
			"role":       role,
		},
	})
}

func (h *AuthHandler) RefreshTokenHandler(c fiber.Ctx) error {
	var req payload.RefreshTokenRequest
	if err := c.Bind().JSON(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request",
		})
	}

	if err := pkg.Validator.Struct(req); err != nil {
		errors := err.(validator.ValidationErrors)
		return c.Status(fiber.StatusBadRequest).JSON(errors)
	}

	resp, err := h.Supabase.Auth.RefreshToken(req.RefreshToken)

	if err != nil || resp == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid or expired refresh token",
		})
	}

	// Fetch role from database
	role := "user"
	_ = h.DB.Pool.QueryRow(c.Context(), "SELECT role FROM public.users WHERE id = $1", resp.User.ID).Scan(&role)
	if role == "user" {
		// Fallback to metadata
		if r, ok := resp.User.UserMetadata["role"].(string); ok {
			role = r
		}
	}

	return c.JSON(fiber.Map{
		"access_token":  resp.AccessToken,
		"refresh_token": resp.RefreshToken,
		"expires_in":    resp.ExpiresIn,
		"token_type":    resp.TokenType,
		"user": fiber.Map{
			"id":         resp.User.ID,
			"email":      resp.User.Email,
			"first_name": resp.User.UserMetadata["first_name"],
			"last_name":  resp.User.UserMetadata["last_name"],
			"role":       role,
		},
	})
}

func (h *AuthHandler) GetPublishedFormsCount(c fiber.Ctx) error {
	var count int
	err := h.DB.Pool.QueryRow(c.Context(), "SELECT COUNT(*) FROM forms WHERE status = 'published'").Scan(&count)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error":  "Failed to count published forms",
			"detail": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"count": count,
	})
}

func (h *AuthHandler) GoogleLoginHandler(c fiber.Ctx) error {
	resp, err := h.Supabase.Auth.Authorize(types.AuthorizeRequest{
		Provider: "google",
	})
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error":  "Failed to initiate Google login",
			"detail": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"url": resp.AuthorizationURL,
	})
}

func (h *AuthHandler) GoogleSyncHandler(c fiber.Ctx) error {
	authHeader := c.Get("Authorization")
	if authHeader == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Missing authorization header",
		})
	}

	token := strings.TrimPrefix(authHeader, "Bearer ")
	if token == authHeader {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid authorization header format",
		})
	}

	authClient := h.Supabase.Auth.WithToken(token)
	user, err := authClient.GetUser()
	if err != nil || user == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid or expired token",
		})
	}

	// Extract name from Google metadata with fallbacks
	firstName := ""
	lastName := ""

	if name, ok := user.UserMetadata["full_name"].(string); ok && name != "" {
		firstName = name
	} else if name, ok := user.UserMetadata["name"].(string); ok && name != "" {
		firstName = name
	} else if name, ok := user.UserMetadata["first_name"].(string); ok && name != "" {
		firstName = name
	}

	if name, ok := user.UserMetadata["last_name"].(string); ok && name != "" {
		lastName = name
	}

	role := "user"
	if r, ok := user.UserMetadata["role"].(string); ok && r != "" {
		role = r
	}

	// Upsert into public.users
	_, err = h.DB.Pool.Exec(c.Context(), `
		INSERT INTO public.users (id, first_name, last_name, email, role, is_verified, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, now())
		ON CONFLICT (id) DO UPDATE
		SET first_name = CASE WHEN EXCLUDED.first_name != '' THEN EXCLUDED.first_name ELSE public.users.first_name END,
		    last_name = CASE WHEN EXCLUDED.last_name != '' THEN EXCLUDED.last_name ELSE public.users.last_name END,
		    role = EXCLUDED.role,
		    is_verified = true,
		    updated_at = now()
	`, user.ID, firstName, lastName, user.Email, role, true)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error":  "Failed to sync user data",
			"detail": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"message": "User synced successfully",
		"user": fiber.Map{
			"id":          user.ID,
			"email":       user.Email,
			"first_name":  firstName,
			"last_name":   lastName,
			"role":        role,
			"is_verified": true,
		},
	})
}
