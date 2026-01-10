import React from 'react';
import { useBuilder, type Question } from '../context/BuilderContext';
import { Trash2, Copy } from 'lucide-react';

const QuestionItem: React.FC<{ question: Question }> = ({ question }) => {
    const { selectedId, selectItem, deleteQuestion, updateQuestion, addQuestion } = useBuilder();
    const isSelected = selectedId === question.id;

    const handleDuplicate = (e: React.MouseEvent) => {
        e.stopPropagation();
        addQuestion(question.type);
        // Note: In a real app, we'd copy the properties too.
        // For now, addQuestion creates a new default one.
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        deleteQuestion(question.id);
    };

    return (
        <div
            onClick={() => selectItem(question.id)}
            className={`group relative rounded-lg border-2 p-6 transition-all cursor-pointer ${isSelected
                ? 'border-brand-500 bg-white shadow-sm'
                : 'border-transparent hover:bg-neutral-100'
                }`}
        >
            <div className="mb-4">
                <input
                    type="text"
                    value={question.title}
                    onChange={(e) => updateQuestion(question.id, { title: e.target.value })}
                    className="w-full bg-transparent text-lg font-medium text-neutral-900 placeholder-neutral-400 focus:outline-none"
                    placeholder="Question Title"
                />
                {question.description !== undefined && (
                    <input
                        type="text"
                        value={question.description || ''}
                        onChange={(e) => updateQuestion(question.id, { description: e.target.value })}
                        className="mt-1 w-full bg-transparent text-sm text-neutral-500 placeholder-neutral-400 focus:outline-none"
                        placeholder="Description (optional)"
                    />
                )}
            </div>

            <div className="pointer-events-none">
                {question.type === 'short-text' && (
                    <input disabled type="text" className="w-full border-b border-neutral-200 py-2 text-neutral-400" placeholder="Short answer text" />
                )}
                {question.type === 'long-text' && (
                    <textarea disabled className="w-full border-b border-neutral-200 py-2 text-neutral-400 resize-none" placeholder="Long answer text" />
                )}
                {(question.type === 'single-select' || question.type === 'multi-select' || question.type === 'dropdown') && (
                    <div className="space-y-2">
                        {question.options?.map((option, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-neutral-500">
                                {question.type === 'single-select' && <div className="h-4 w-4 rounded-full border border-neutral-300" />}
                                {question.type === 'multi-select' && <div className="h-4 w-4 rounded border border-neutral-300" />}
                                {question.type === 'dropdown' && <span className="text-xs text-neutral-400">{idx + 1}.</span>}
                                <span>{option}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {isSelected && (
                <div className="absolute -right-12 top-0 flex flex-col gap-2">
                    <button
                        onClick={handleDuplicate}
                        className="rounded-md bg-white p-2 text-neutral-500 shadow-sm hover:text-brand-600 hover:shadow-md transition-all"
                        title="Duplicate"
                    >
                        <Copy className="h-4 w-4" />
                    </button>
                    <button
                        onClick={handleDelete}
                        className="rounded-md bg-white p-2 text-neutral-500 shadow-sm hover:text-red-600 hover:shadow-md transition-all"
                        title="Delete"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            )}
        </div>
    );
};

export const Canvas: React.FC = () => {
    const { questions, title, description, setTitle, setDescription, selectItem, selectedId } = useBuilder();

    return (
        <div
            className="flex-1 overflow-y-auto bg-white px-4 py-12 sm:px-6 lg:px-8"
            onClick={() => selectItem(null)} // Click outside to select form settings
        >
            <div className="mx-auto max-w-2xl space-y-8">
                {/* Form Header */}
                <div
                    onClick={(e) => { e.stopPropagation(); selectItem(null); }}
                    className={`group rounded-lg border-2 p-6 transition-all cursor-pointer ${selectedId === null
                        ? 'border-brand-500 bg-white shadow-sm'
                        : 'border-transparent hover:bg-neutral-50'
                        }`}
                >
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-transparent text-3xl font-bold text-neutral-900 placeholder-neutral-400 focus:outline-none"
                        placeholder="Form Title"
                    />
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-2 w-full resize-none bg-transparent text-base text-neutral-500 placeholder-neutral-400 focus:outline-none"
                        placeholder="Form description"
                        rows={2}
                    />
                </div>

                {/* Questions List */}
                <div className="space-y-4">
                    {questions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center text-neutral-400">
                            <p>Click a question type on the left to add it to your form.</p>
                        </div>
                    ) : (
                        questions.map((q) => (
                            <div key={q.id} onClick={(e) => e.stopPropagation()}>
                                <QuestionItem question={q} />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
