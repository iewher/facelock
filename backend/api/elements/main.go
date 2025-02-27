package elements

import (
	"context"
	"facelock/api/db"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
)

type element struct {
	ID       string `json:"id"`
	Title    string `json:"title"`
	Password string `json:"password"`
	Url      string `json:"url"`
}

// Создать элемент.
func CreateElement(c *gin.Context) {
	var newElement element

	if err := c.BindJSON(&newElement); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Basic validation (add more as needed)
	if newElement.ID == "" || newElement.Title == "" || newElement.Password == "" || newElement.Url == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing required fields"})
		return
	}

	ctx := context.Background()
	sql := `INSERT INTO elements (id, title, password, url) VALUES ($1, $2, $3, $4)`
	_, err := db.GetDB().Exec(ctx, sql, newElement.ID, newElement.Title, newElement.Password, newElement.Url)
	if err != nil {
		log.Printf("Error inserting element: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create element"})
		return
	}

	c.IndentedJSON(http.StatusCreated, newElement)
}

// Получить список всех элементов.
func GetElements(c *gin.Context) {
	ctx := context.Background()
	sql := `SELECT id, title, password, url FROM elements`
	rows, err := db.GetDB().Query(ctx, sql)
	if err != nil {
		log.Printf("Error querying elements: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve elements"})
		return
	}
	defer rows.Close()

	var elements []element
	for rows.Next() {
		var elem element
		err := rows.Scan(&elem.ID, &elem.Title, &elem.Password, &elem.Url)
		if err != nil {
			log.Printf("Error scanning element: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process elements"})
			return
		}
		elements = append(elements, elem)
	}

	if err := rows.Err(); err != nil {
		log.Printf("Error iterating rows: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve elements"})
		return
	}

	c.IndentedJSON(http.StatusOK, elements)
}

// Получить элемент по ID.
func GetElementByID(c *gin.Context) {
	id := c.Param("id")

	ctx := context.Background()
	sql := `SELECT id, title, password, url FROM elements WHERE id = $1`
	row := db.GetDB().QueryRow(ctx, sql, id)

	var elem element
	err := row.Scan(&elem.ID, &elem.Title, &elem.Password, &elem.Url)
	if err != nil {
		if err == pgx.ErrNoRows {
			c.IndentedJSON(http.StatusNotFound, gin.H{"message": "element not found"})
		} else {
			log.Printf("Error scanning element: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve element"})
		}
		return
	}

	c.IndentedJSON(http.StatusOK, elem)
}

// Обновить элемент.
func UpdateElement(c *gin.Context) {
	id := c.Param("id")
	var updatedElement element

	if err := c.BindJSON(&updatedElement); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx := context.Background()
	sql := `UPDATE elements SET title = $1, password = $2, url = $3 WHERE id = $4`
	result, err := db.GetDB().Exec(ctx, sql, updatedElement.Title, updatedElement.Password, updatedElement.Url, id)
	if err != nil {
		log.Printf("Error updating element: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update element"})
		return
	}

	rowsAffected := result.RowsAffected()
	if rowsAffected == 0 {
		c.IndentedJSON(http.StatusNotFound, gin.H{"message": "element not found"})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"message": "element updated successfully"})
}

// Удалить элемент.
func DeleteElement(c *gin.Context) {
	id := c.Param("id")

	ctx := context.Background()
	sql := `DELETE FROM elements WHERE id = $1`
	result, err := db.GetDB().Exec(ctx, sql, id)
	if err != nil {
		log.Printf("Error deleting element: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete element"})
		return
	}

	rowsAffected := result.RowsAffected()
	if rowsAffected == 0 {
		c.IndentedJSON(http.StatusNotFound, gin.H{"message": "element not found"})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"message": "element deleted successfully"})
}
