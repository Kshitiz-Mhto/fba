import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type QuestionType = 'short-text' | 'long-text' | 'single-select' | 'multi-select' | 'dropdown';

export interface Question {
    id: string;
    type: QuestionType;
    title: string;
    description?: string;
    required: boolean;
    options?: string[];
    emoji?: string;
}

interface FormState {
    title: string;
    description: string;
    questions: Question[];
    selectedId: string | null;
}

const initialState: FormState = {
    title: 'Untitled Form',
    description: '',
    questions: [],
    selectedId: null,
};

export const formSlice = createSlice({
    name: 'form',
    initialState,
    reducers: {
        setTitle: (state, action: PayloadAction<string>) => {
            state.title = action.payload;
        },
        setDescription: (state, action: PayloadAction<string>) => {
            state.description = action.payload;
        },
        addQuestion: (state, action: PayloadAction<QuestionType>) => {
            const newQuestion: Question = {
                id: crypto.randomUUID(),
                type: action.payload,
                title: 'Untitled Question',
                required: false,
                options: ['single-select', 'multi-select', 'dropdown'].includes(action.payload)
                    ? ['Option 1', 'Option 2']
                    : undefined,
            };
            state.questions.push(newQuestion);
            state.selectedId = newQuestion.id;
        },
        updateQuestion: (state, action: PayloadAction<{ id: string; updates: Partial<Question> }>) => {
            const { id, updates } = action.payload;
            const question = state.questions.find((q) => q.id === id);
            if (question) {
                Object.assign(question, updates);
            }
        },
        deleteQuestion: (state, action: PayloadAction<string>) => {
            state.questions = state.questions.filter((q) => q.id !== action.payload);
            if (state.selectedId === action.payload) {
                state.selectedId = null;
            }
        },
        selectItem: (state, action: PayloadAction<string | null>) => {
            state.selectedId = action.payload;
        },
        reorderQuestions: (state, action: PayloadAction<{ startIndex: number; endIndex: number }>) => {
            const { startIndex, endIndex } = action.payload;
            const [removed] = state.questions.splice(startIndex, 1);
            state.questions.splice(endIndex, 0, removed);
        },
        setForm: (state, action: PayloadAction<{ title: string; description: string; questions: any[] }>) => {
            state.title = action.payload.title;
            state.description = action.payload.description || '';
            state.questions = (action.payload.questions || []).map((q) => ({
                id: q.id,
                type: q.type,
                title: q.title,
                description: q.description || '',
                required: q.required,
                emoji: q.emoji || '',
                options: q.options ? q.options.map((opt: any) => opt.label) : undefined,
            }));
        },
        resetForm: (state) => {
            state.title = initialState.title;
            state.description = initialState.description;
            state.questions = initialState.questions;
            state.selectedId = initialState.selectedId;
        },
    },
});

export const {
    setTitle,
    setDescription,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    selectItem,
    reorderQuestions,
    setForm,
    resetForm,
} = formSlice.actions;

export default formSlice.reducer;
