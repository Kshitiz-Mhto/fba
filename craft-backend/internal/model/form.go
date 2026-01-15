package model

import (
	"time"

	"github.com/google/uuid"
)

type Form struct {
	ID                       uuid.UUID  `json:"id"`
	OwnerID                  uuid.UUID  `json:"owner_id"`
	Title                    string     `json:"title"`
	Description              *string    `json:"description"`
	Status                   string     `json:"status"` // draft, published, closed
	IsPublic                 bool       `json:"is_public"`
	AllowMultipleSubmissions bool       `json:"allow_multiple_submissions"`
	CloseDate                *time.Time `json:"close_date"`
	ThankYouMessage          *string    `json:"thank_you_message"`
	RedirectURL              *string    `json:"redirect_url"`
	CreatedAt                time.Time  `json:"created_at"`
	UpdatedAt                time.Time  `json:"updated_at"`
	Responses                int        `json:"responses"`
	Questions                []Question `json:"questions,omitempty"`
}

type Question struct {
	ID          uuid.UUID `json:"id"`
	FormID      uuid.UUID `json:"form_id"`
	Type        string    `json:"type"`
	Title       string    `json:"title"`
	Description *string   `json:"description"`
	Emoji       *string   `json:"emoji"`
	Position    int       `json:"position"`
	Required    bool      `json:"required"`
	Options     []Option  `json:"options,omitempty"`
}

type Option struct {
	ID         uuid.UUID `json:"id"`
	QuestionID uuid.UUID `json:"question_id"`
	Label      string    `json:"label"`
	Position   int       `json:"position"`
}
