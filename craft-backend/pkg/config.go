package pkg

import (
	"log"

	"github.com/joho/godotenv"
)

type Config struct {
	API_PORT     int
	DATABASE_URL string
	PROJECT_URL  string
	SECRET_KEY   string
	ANON_KEY     string
	DEV_MODE     bool
}

var Envs = initConfig()

func initConfig() Config {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	return Config{
		API_PORT:     GetEnvAsInt("PORT", 8080),
		DATABASE_URL: GetEnv("DATABASE_URL", ""),
		PROJECT_URL:  GetEnv("PROJECT_URL", ""),
		SECRET_KEY:   GetEnv("SECRET_KEY", ""),
		ANON_KEY:     GetEnv("ANON_KEY", ""),
		DEV_MODE:     GetEnv("DEV_MODE", "false") == "true",
	}
}
