package server

import (
	"github.com/gofiber/fiber/v3"
)

func (s *FiberServer) PingPongHandler(c fiber.Ctx) error {
	resp := fiber.Map{
		"message": "pong",
	}
	return c.JSON(resp)
}

func (s *FiberServer) dbHealthCheckHandler(c fiber.Ctx) error {
	version, err := s.DB.HealthCheck()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error":   "Database health check failed",
			"details": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"status":           "ok",
		"postgres_version": version,
	})
}
