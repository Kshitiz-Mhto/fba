import React, { createContext, useContext, useState, useCallback } from 'react';

export type QuestionType = 'short-text' | 'long-text' | 'single-select' | 'multi-select' | 'dropdown';

export interface Question {
    id: string;
    type: QuestionType;
    title: string;
    description?: string;
    required: boolean;
    options?: string[];
}

interface BuilderState {
    title: string;
    description: string;
    questions: Question[];
    selectedId: string | null; // null means form settings selected
}

interface BuilderContextType extends BuilderState {
    setTitle: (title: string) => void;
    setDescription: (description: string) => void;
    addQuestion: (type: QuestionType) => void;
    updateQuestion: (id: string, updates: Partial<Question>) => void;
    deleteQuestion: (id: string) => void;
    selectItem: (id: string | null) => void;
    reorderQuestions: (startIndex: number, endIndex: number) => void;
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

export const BuilderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [title, setTitle] = useState('Untitled Form');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const addQuestion = useCallback((type: QuestionType) => {
        const newQuestion: Question = {
            id: crypto.randomUUID(),
            type,
            title: 'Untitled Question',
            required: false,
            options: type === 'single-select' || type === 'multi-select' || type === 'dropdown'
                ? ['Option 1', 'Option 2']
                : undefined,
        };
        setQuestions((prev) => [...prev, newQuestion]);
        setSelectedId(newQuestion.id);
    }, []);

    const updateQuestion = useCallback((id: string, updates: Partial<Question>) => {
        setQuestions((prev) =>
            prev.map((q) => (q.id === id ? { ...q, ...updates } : q))
        );
    }, []);

    const deleteQuestion = useCallback((id: string) => {
        setQuestions((prev) => prev.filter((q) => q.id !== id));
        if (selectedId === id) {
            setSelectedId(null);
        }
    }, [selectedId]);

    const selectItem = useCallback((id: string | null) => {
        setSelectedId(id);
    }, []);

    const reorderQuestions = useCallback((startIndex: number, endIndex: number) => {
        setQuestions((prev) => {
            const result = Array.from(prev);
            const [removed] = result.splice(startIndex, 1);
            result.splice(endIndex, 0, removed);
            return result;
        });
    }, []);

    return (
        <BuilderContext.Provider
            value={{
                title,
                description,
                questions,
                selectedId,
                setTitle,
                setDescription,
                addQuestion,
                updateQuestion,
                deleteQuestion,
                selectItem,
                reorderQuestions,
            }}
        >
            {children}
        </BuilderContext.Provider>
    );
};

export const useBuilder = () => {
    const context = useContext(BuilderContext);
    if (context === undefined) {
        throw new Error('useBuilder must be used within a BuilderProvider');
    }
    return context;
};
