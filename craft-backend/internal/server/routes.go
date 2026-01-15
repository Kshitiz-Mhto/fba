package server

import (
	auth "craft/internal/server/handlers"
	"craft/internal/server/handlers/admin"
	"craft/internal/server/handlers/user"
	"craft/internal/server/middlewares"
)

func (s *FiberServer) RegisterFiberRoutes() {
	s.App.Use(middlewares.RequestIDMiddleware())
	s.App.Use(middlewares.LoggingMiddleware())
	s.App.Use(middlewares.CORS())

	s.registerAPIv1Routes()

}

func (s *FiberServer) registerAPIv1Routes() {
	v1 := s.App.Group("/api/v1")
	authHandler := auth.NewAuthHandler(s.Supabase, s.DB)
	adminHandler := admin.NewAdminHandler(s.Supabase, s.DB)
	userHandler := user.NewUserHandler(s.Supabase, s.DB)
	formHandler := user.NewFormHandler(s.Supabase, s.DB)
	submissionHandler := user.NewSubmissionHandler(s.Supabase, s.DB)

	// checkups
	v1.Get("/ping", s.PingPongHandler)
	v1.Get("/health", s.dbHealthCheckHandler)

	// auth
	authGroup := v1.Group("/auth")
	authGroup.Post("/signup", authHandler.EmailSignupHandler)
	authGroup.Post("/user-verify", authHandler.CompleteEmailVerificationHandler)
	authGroup.Post("/login", authHandler.EmailLoginHandler)
	authGroup.Post("/refresh", authHandler.RefreshTokenHandler)
	authGroup.Get("/google", authHandler.GoogleLoginHandler)
	authGroup.Post("/google/sync", authHandler.GoogleSyncHandler)

	// users
	userGroup := v1.Group("/user")
	userGroup.Use(middlewares.AuthMiddleware(s.Supabase, s.DB))
	userGroup.Use(middlewares.RBACMiddleware("user", "admin"))
	userGroup.Get("/dashboard", userHandler.GetDashboardData)
	userGroup.Post("/forms", formHandler.CreateForm)
	userGroup.Get("/forms/:id", formHandler.GetForm)
	userGroup.Put("/forms/:id", formHandler.UpdateForm)
	userGroup.Post("/forms/:id/duplicate", formHandler.DuplicateForm)
	userGroup.Put("/forms/:id/publish", formHandler.PublishForm)
	userGroup.Put("/forms/:id/unpublish", formHandler.UnpublishForm)
	userGroup.Delete("/forms/:id", formHandler.DeleteForm)
	userGroup.Get("/forms/:id/submissions", submissionHandler.GetFormSubmissions)

	// public
	publicGroup := v1.Group("/public")
	publicGroup.Get("/forms/:username/:slug", formHandler.GetPublicForm)
	publicGroup.Post("/forms/:id/submit", submissionHandler.SubmitForm)

	// admin
	admin := v1.Group("/admin")
	admin.Use(middlewares.AuthMiddleware(s.Supabase, s.DB))
	admin.Use(middlewares.RBACMiddleware("admin"))
	admin.Get("/users", adminHandler.GetAllUsers)
	admin.Get("/forms", adminHandler.GetAllForms)
	admin.Get("/users/:id/forms", adminHandler.GetUserForms)
	admin.Get("/users-with-forms", adminHandler.GetAllUsersWithForms)
	admin.Delete("/users/:id", adminHandler.DeleteUser)
	admin.Delete("/forms/:id", adminHandler.DeleteForm)
	admin.Get("/published-count", adminHandler.GetPublishedFormsCount)

}
