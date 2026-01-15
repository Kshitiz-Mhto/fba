package main

import (
	"context"
	"craft/internal/db"
	"craft/internal/server"
	"craft/pkg"
	"fmt"
	"log"
	"os"
	"os/signal"
	"strconv"
	"syscall"
	"time"

	_ "github.com/joho/godotenv/autoload"
	"github.com/supabase-community/supabase-go"
)

func gracefulShutdown(fiberServer *server.FiberServer, done chan bool) {
	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	<-ctx.Done()

	log.Println("shutting down gracefully, press Ctrl+C again to force")
	stop()

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := fiberServer.ShutdownWithContext(ctx); err != nil {
		log.Printf("Server forced to shutdown with error: %v", err)
	}

	log.Println("Server exiting")

	done <- true
}

func main() {
	supabaseURL := pkg.Envs.PROJECT_URL
	supabaseKey := pkg.Envs.ANON_KEY
	supabaseDB := pkg.Envs.DATABASE_URL

	database, err := db.NewDatabase(supabaseDB)
	if err != nil {
		log.Fatal("Failed to initialize database:", err)
	}

	defer database.Pool.Close()

	supabaseClient, err := supabase.NewClient(supabaseURL, supabaseKey, &supabase.ClientOptions{})
	if err != nil {
		log.Fatalf("Failed to initalize the supabase client: %v", err)
	}

	server := server.New(database, supabaseClient)

	server.RegisterFiberRoutes()

	done := make(chan bool, 1)

	go func() {
		port, _ := strconv.Atoi(os.Getenv("PORT"))
		err := server.Listen(fmt.Sprintf(":%d", port))
		if err != nil {
			panic(fmt.Sprintf("http server error: %s", err))
		}
	}()

	go gracefulShutdown(server, done)

	<-done
	log.Println("Graceful shutdown complete.")
}
