package main

import (
	"facelock/api/db"
	"facelock/api/elements"
	"fmt"
	"os"

	"github.com/gin-gonic/gin"
)

func main() {
	err := db.ConnectDB()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Failed to connect to database: %v\n", err)
		os.Exit(1)
	}
	defer db.CloseDB()

	router := gin.Default()

	// Элементы.

	router.POST("/elements", elements.CreateElement)
	router.GET("/elements", elements.GetElements)
	router.GET("/elements/:id", elements.GetElementByID)
	router.POST("/elements/:id", elements.UpdateElement)
	router.DELETE("/elements/:id", elements.DeleteElement)

	router.Run("localhost:8080")
}
