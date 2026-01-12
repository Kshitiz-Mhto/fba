import React from 'react';
import { Type, AlignLeft, CheckSquare, List, ChevronDown } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addQuestion, type QuestionType } from '../../../store/slices/formSlice';

export const LeftPanel: React.FC = () => {
    const dispatch = useDispatch();

    const questionTypes: { type: QuestionType; icon: React.ElementType; label: string }[] = [
        { type: 'short-text', icon: Type, label: 'Short Text' },
        { type: 'long-text', icon: AlignLeft, label: 'Long Text' },
        { type: 'single-select', icon: List, label: 'Single Select' },
        { type: 'multi-select', icon: CheckSquare, label: 'Multiple Choice' },
        { type: 'dropdown', icon: ChevronDown, label: 'Dropdown' },
    ];

    return (
        <div className="flex h-full w-64 flex-col border-r border-neutral-200 bg-neutral-50">
            <div className="p-4">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Question Types
                </h2>
            </div>
            <div className="flex-1 overflow-y-auto px-2">
                <div className="space-y-1">
                    {questionTypes.map(({ type, icon: Icon, label }) => (
                        <button
                            key={type}
                            onClick={() => dispatch(addQuestion(type))}
                            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-200/50 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                        >
                            <Icon className="h-4 w-4 text-neutral-500" />
                            {label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
