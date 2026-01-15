import React, { useState } from 'react';
import { X, Smile } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import EmojiPicker, { type EmojiClickData } from 'emoji-picker-react';
import type { RootState } from '../../../store/store';
import { updateQuestion, selectItem } from '../../../store/slices/formSlice';

export const RightPanel: React.FC = () => {
    const dispatch = useDispatch();
    const { questions, selectedId } = useSelector((state: RootState) => state.form);
    const selectedQuestion = questions.find((q) => q.id === selectedId);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    if (!selectedQuestion) {
        return (
            <div className="w-80 border-l border-neutral-200 bg-white p-6">
                <div className="flex h-full flex-col items-center justify-center text-center text-neutral-500">
                    <p>Select a question to edit its settings</p>
                </div>
            </div>
        );
    }

    const handleEmojiClick = (emojiData: EmojiClickData) => {
        dispatch(updateQuestion({
            id: selectedQuestion.id,
            updates: { emoji: emojiData.emoji }
        }));
        setShowEmojiPicker(false);
    };

    return (
        <div className="w-80 flex flex-col border-l border-neutral-200 bg-white">
            <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
                <h2 className="text-lg font-semibold text-neutral-900">Settings</h2>
                <button
                    onClick={() => dispatch(selectItem(null))}
                    className="rounded-md p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-500"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700">Type</label>
                        <div className="mt-1 block w-full rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-500 capitalize">
                            {selectedQuestion.type.replace('-', ' ')}
                        </div>
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Icon / Emoji</label>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                className="flex h-10 w-10 items-center justify-center rounded-md border border-neutral-300 hover:bg-neutral-50 transition-colors text-xl"
                            >
                                {selectedQuestion.emoji || <Smile className="h-5 w-5 text-neutral-400" />}
                            </button>
                            {selectedQuestion.emoji && (
                                <button
                                    onClick={() => dispatch(updateQuestion({ id: selectedQuestion.id, updates: { emoji: undefined } }))}
                                    className="text-sm text-red-500 hover:text-red-600"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                        {showEmojiPicker && (
                            <div className="absolute top-full left-0 z-50 mt-2">
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setShowEmojiPicker(false)}
                                />
                                <div className="relative z-50 shadow-xl rounded-lg">
                                    <EmojiPicker onEmojiClick={handleEmojiClick} width={300} height={400} />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-neutral-700">Required</label>
                        <input
                            type="checkbox"
                            checked={selectedQuestion.required}
                            onChange={(e) => dispatch(updateQuestion({ id: selectedQuestion.id, updates: { required: e.target.checked } }))}
                            className="h-4 w-4 rounded border-neutral-300 text-brand-600 focus:ring-brand-500"
                        />
                    </div>

                    {(selectedQuestion.type === 'single-select' || selectedQuestion.type === 'multi-select' || selectedQuestion.type === 'dropdown') && (
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">Options</label>
                            <div className="space-y-2">
                                {selectedQuestion.options?.map((option, idx) => (
                                    <div key={idx} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={option}
                                            onChange={(e) => {
                                                const newOptions = [...(selectedQuestion.options || [])];
                                                newOptions[idx] = e.target.value;
                                                dispatch(updateQuestion({ id: selectedQuestion.id, updates: { options: newOptions } }));
                                            }}
                                            className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm py-1.5 px-3 border"
                                        />
                                        <button
                                            onClick={() => {
                                                const newOptions = selectedQuestion.options?.filter((_, i) => i !== idx);
                                                dispatch(updateQuestion({ id: selectedQuestion.id, updates: { options: newOptions } }));
                                            }}
                                            className="p-1.5 text-neutral-400 hover:text-red-500"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={() => {
                                        const newOptions = [...(selectedQuestion.options || []), `Option ${(selectedQuestion.options?.length || 0) + 1}`];
                                        dispatch(updateQuestion({ id: selectedQuestion.id, updates: { options: newOptions } }));
                                    }}
                                    className="mt-2 text-sm font-medium text-brand-600 hover:text-brand-700"
                                >
                                    + Add Option
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
