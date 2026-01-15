package server

import (
	"craft/internal/db"

	"github.com/gofiber/fiber/v3"
	"github.com/supabase-community/supabase-go"
)

type FiberServer struct {
	*fiber.App
	DB       *db.Database
	Supabase *supabase.Client
}

func New(db *db.Database, supabaseClient *supabase.Client) *FiberServer {

	server := &FiberServer{
		App: fiber.New(fiber.Config{
			ServerHeader: "craft",
			AppName:      "craft",
		}),
		DB:       db,
		Supabase: supabaseClient,
	}

	return server
}
