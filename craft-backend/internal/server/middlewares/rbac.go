package middlewares

import (
	"craft/internal/db"
	"strings"

	"github.com/gofiber/fiber/v3"
	"github.com/supabase-community/supabase-go"
)

func AuthMiddleware(supabase *supabase.Client, database *db.Database) fiber.Handler {
	return func(c fiber.Ctx) error {
		authHeader := c.Get("Authorization")
		if authHeader == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Missing authorization header",
			})
		}

		token := strings.TrimPrefix(authHeader, "Bearer ")
		if token == authHeader {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Invalid authorization header format. Expected: Bearer <token>",
			})
		}

		authClient := supabase.Auth.WithToken(token)
		user, err := authClient.GetUser()
		if err != nil || user == nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Invalid or expired token",
			})
		}

		c.Locals("user_id", user.ID)
		c.Locals("user_email", user.Email)
		c.Locals("user", user)

		var role string
		err = database.Pool.QueryRow(c.Context(), "SELECT role FROM public.users WHERE id = $1", user.ID).Scan(&role)
		if err != nil {
			if r, ok := user.UserMetadata["role"].(string); ok {
				role = r
			} else {
				role = "user" // Default role
			}
		}

		c.Locals("user_role", role)

		return c.Next()
	}
}

func RBACMiddleware(allowedRoles ...string) fiber.Handler {
	return func(c fiber.Ctx) error {
		userRole := c.Locals("user_role")
		if userRole == nil {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"error": "User role not found. Ensure AuthMiddleware is applied first.",
			})
		}

		role, ok := userRole.(string)
		if !ok {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"error": "Invalid user role format",
			})
		}

		for _, allowedRole := range allowedRoles {
			if role == allowedRole {
				return c.Next()
			}
		}

		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"error":     "Access denied. Insufficient permissions.",
			"required":  allowedRoles,
			"user_role": role,
		})
	}
}
