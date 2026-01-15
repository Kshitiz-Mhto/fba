package db

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Database struct {
	Pool *pgxpool.Pool
}

func NewDatabase(connString string) (*Database, error) {
	ctx := context.Background()

	pool, err := pgxpool.New(ctx, connString)
	if err != nil {
		return nil, err
	}

	return &Database{
		Pool: pool,
	}, nil
}

func (d *Database) HealthCheck() (string, error) {
	ctx := context.Background()

	var version string
	err := d.Pool.QueryRow(ctx, "SELECT version()").Scan(&version)
	if err != nil {
		return "", err
	}

	return version, nil
}
