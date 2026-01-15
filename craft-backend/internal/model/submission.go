package model

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"
)

type Submission struct {
	ID               uuid.UUID  `json:"id"`
	FormID           uuid.UUID  `json:"form_id"`
	RespondentEmail  *string    `json:"respondent_email"`
	RespondentUserID *uuid.UUID `json:"respondent_user_id"`
	IPAddress        *string    `json:"ip_address"`
	UserAgent        *string    `json:"user_agent"`
	CreatedAt        time.Time  `json:"created_at"`
}

type Answer struct {
	ID           uuid.UUID       `json:"id"`
	SubmissionID uuid.UUID       `json:"submission_id"`
	QuestionID   uuid.UUID       `json:"question_id"`
	Value        json.RawMessage `json:"value"` // JSONB to support both single and multi-select answers
	CreatedAt    time.Time       `json:"created_at"`
}

type SubmissionWithAnswers struct {
	Submission
	Answers []Answer `json:"answers"`
}
