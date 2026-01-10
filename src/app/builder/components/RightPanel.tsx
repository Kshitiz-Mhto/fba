import React from 'react';
import { useBuilder } from '../context/BuilderContext';
import { X } from 'lucide-react';

export const RightPanel: React.FC = () => {
    const { selectedId, questions, updateQuestion } = useBuilder();

    const selectedQuestion = questions.find((q) => q.id === selectedId);

    if (!selectedId) {
        return (
            <div className="flex h-full w-80 flex-col border-l border-neutral-200 bg-white">
                <div className="border-b border-neutral-200 p-4">
                    <h2 className="text-sm font-semibold text-neutral-900">Form Settings</h2>
                </div>
                <div className="p-4">
                    <p className="text-sm text-neutral-500">
                        Global form settings like theme, typography, and access control will go here.
                    </p>
                </div>
            </div>
        );
    }

    if (!selectedQuestion) return null;

    return (
        <div className="flex h-full w-80 flex-col border-l border-neutral-200 bg-white">
            <div className="flex items-center justify-between border-b border-neutral-200 p-4">
                <h2 className="text-sm font-semibold text-neutral-900">Question Settings</h2>
                <button className="text-neutral-400 hover:text-neutral-600">
                    <X className="h-4 w-4" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Common Settings */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-neutral-700">Required</label>
                        <input
                            type="checkbox"
                            checked={selectedQuestion.required}
                            onChange={(e) => updateQuestion(selectedQuestion.id, { required: e.target.checked })}
                            className="h-4 w-4 rounded border-neutral-300 text-brand-600 focus:ring-brand-500"
                        />
                    </div>
                </div>

                {/* Type Specific Settings */}
                {(selectedQuestion.type === 'single-select' || selectedQuestion.type === 'multi-select' || selectedQuestion.type === 'dropdown') && (
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-neutral-700">Options</label>
                        <div className="space-y-2">
                            {selectedQuestion.options?.map((option, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={option}
                                        onChange={(e) => {
                                            const newOptions = [...(selectedQuestion.options || [])];
                                            newOptions[idx] = e.target.value;
                                            updateQuestion(selectedQuestion.id, { options: newOptions });
                                        }}
                                        className="flex-1 rounded-md border border-neutral-200 px-3 py-1.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                                    />
                                    <button
                                        onClick={() => {
                                            const newOptions = selectedQuestion.options?.filter((_, i) => i !== idx);
                                            updateQuestion(selectedQuestion.id, { options: newOptions });
                                        }}
                                        className="text-neutral-400 hover:text-red-500"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={() => {
                                    const newOptions = [...(selectedQuestion.options || []), `Option ${(selectedQuestion.options?.length || 0) + 1}`];
                                    updateQuestion(selectedQuestion.id, { options: newOptions });
                                }}
                                className="text-sm font-medium text-brand-600 hover:text-brand-700"
                            >
                                + Add Option
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
