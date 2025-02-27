package db

import (
	"context"
	"log"
	"sync"
	"time"

	"github.com/jackc/pgx/v5"
)

var (
	conn *pgx.Conn
	once sync.Once
)

func ConnectDB() error {
	var err error
	once.Do(func() {
		ctx := context.Background()
		databaseUrl := "postgres://postgres:password@localhost:54323/postgres"
		config, err := pgx.ParseConfig(databaseUrl)
		if err != nil {
			log.Fatalf("Failed to parse database URL: %v", err)
			return
		}

		config.ConnectTimeout = 5 * time.Second

		conn, err = pgx.ConnectConfig(ctx, config)
		if err != nil {
			log.Fatalf("Failed to connect to database: %v", err)
			return
		}

		err = conn.Ping(ctx)
		if err != nil {
			log.Fatalf("Failed to ping database: %v", err)
			return
		}

		log.Println("Successfully connected to the database!")
	})

	return err
}

func CloseDB() {
	if conn != nil {
		err := conn.Close(context.Background())
		if err != nil {
			log.Printf("Error closing database connection: %v", err)
		} else {
			log.Println("Database connection closed.")
		}
	}
}

func GetDB() *pgx.Conn {
	return conn
}
