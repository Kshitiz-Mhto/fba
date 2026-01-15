import React from 'react';
import { X, Calendar, User } from 'lucide-react';

interface Answer {
    id: string;
    question_id: string;
    value: any;
    created_at: string;
}

interface Submission {
    id: string;
    form_id: string;
    respondent_email?: string;
    created_at: string;
    answers: Answer[];
}

interface Question {
    id: string;
    title: string;
    type: string;
    description?: string;
    emoji?: string;
    position: number;
    required: boolean;
    options?: any[];
}

interface SubmissionDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    submission: Submission | null;
    questions: Question[];
    formTitle: string;
}

export const SubmissionDetailModal: React.FC<SubmissionDetailModalProps> = ({
    isOpen,
    onClose,
    submission,
    questions,
    formTitle,
}) => {
    if (!isOpen || !submission) return null;

    const formatValue = (value: any) => {
        if (value === null || value === undefined) return '-';
        if (Array.isArray(value)) return value.join(', ');
        if (typeof value === 'object') return JSON.stringify(value);
        return String(value);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div
                className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
                    <div>
                        <h3 className="text-lg font-bold text-neutral-900">Submission Details</h3>
                        <p className="text-sm text-neutral-500">{formTitle}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Metadata Card */}
                    <div className="mb-8 grid grid-cols-1 gap-4 rounded-xl bg-neutral-50 p-4 sm:grid-cols-2">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-neutral-500 shadow-sm">
                                <Calendar className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-neutral-500 uppercase">Submitted On</p>
                                <p className="text-sm font-semibold text-neutral-900">
                                    {new Date(submission.created_at).toLocaleString()}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-neutral-500 shadow-sm">
                                <User className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-neutral-500 uppercase">Respondent</p>
                                <p className="text-sm font-semibold text-neutral-900">
                                    {submission.respondent_email || 'Anonymous'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Q&A List */}
                    <div className="space-y-6">
                        {questions.map((question, index) => {
                            const answer = submission.answers?.find((a) => a.question_id === question.id);
                            const displayValue = answer ? formatValue(answer.value) : '-';

                            return (
                                <div key={question.id} className="group rounded-lg border border-transparent p-4 transition-colors hover:bg-neutral-50 hover:border-neutral-200">
                                    <div className="mb-2 flex items-start gap-3">
                                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-xs font-bold text-neutral-500">
                                            {index + 1}
                                        </span>
                                        <div>
                                            <h4 className="font-medium text-neutral-900">
                                                {question.emoji && <span className="mr-2">{question.emoji}</span>}
                                                {question.title}
                                                {question.required && <span className="ml-1 text-red-500">*</span>}
                                            </h4>
                                            {question.description && (
                                                <p className="mt-1 text-sm text-neutral-500">{question.description}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="ml-9 rounded-lg border border-neutral-200 bg-white p-3 text-neutral-700 shadow-sm">
                                        {displayValue}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-neutral-200 bg-neutral-50 px-6 py-4">
                    <div className="flex justify-end">
                        <button
                            onClick={onClose}
                            className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 shadow-sm hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
