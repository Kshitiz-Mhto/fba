import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, Copy, GripVertical } from 'lucide-react';
import type { RootState } from '../../../store/store';
import {
    setTitle,
    setDescription,
    updateQuestion,
    deleteQuestion,
    selectItem,
    addQuestion,
    reorderQuestions,
    type Question,
} from '../../../store/slices/formSlice';

interface SortableQuestionItemProps {
    question: Question;
    isSelected: boolean;
}

const SortableQuestionItem: React.FC<SortableQuestionItemProps> = ({ question, isSelected }) => {
    const dispatch = useDispatch();
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: question.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.5 : 1,
    };

    const handleDuplicate = (e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch(addQuestion(question.type));
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch(deleteQuestion(question.id));
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            onClick={(e) => {
                e.stopPropagation();
                dispatch(selectItem(question.id));
            }}
            className={`group relative rounded-lg border-2 p-6 transition-all cursor-pointer ${isSelected
                ? 'border-brand-500 bg-white shadow-sm'
                : 'border-transparent hover:bg-neutral-100'
                }`}
        >
            {/* Drag Handle */}
            <div
                {...attributes}
                {...listeners}
                className={`absolute left-2 top-1/2 -translate-y-1/2 cursor-grab p-2 text-neutral-300 hover:text-neutral-500 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
            >
                <GripVertical className="h-5 w-5" />
            </div>

            <div className="mb-4 pl-8">
                <div className="flex items-center gap-2 mb-2">
                    {question.emoji && <span className="text-2xl">{question.emoji}</span>}
                    <input
                        type="text"
                        value={question.title}
                        onChange={(e) => dispatch(updateQuestion({ id: question.id, updates: { title: e.target.value } }))}
                        className="w-full bg-transparent text-lg font-medium text-neutral-900 placeholder-neutral-400 focus:outline-none"
                        placeholder="Question Title"
                    />
                </div>
                {question.description !== undefined && (
                    <input
                        type="text"
                        value={question.description || ''}
                        onChange={(e) => dispatch(updateQuestion({ id: question.id, updates: { description: e.target.value } }))}
                        className="mt-1 w-full bg-transparent text-sm text-neutral-500 placeholder-neutral-400 focus:outline-none"
                        placeholder="Description (optional)"
                    />
                )}
            </div>

            <div className="pointer-events-none pl-8">
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
    const dispatch = useDispatch();
    const { questions, title, description, selectedId } = useSelector((state: RootState) => state.form);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = questions.findIndex((q) => q.id === active.id);
            const newIndex = questions.findIndex((q) => q.id === over.id);
            dispatch(reorderQuestions({ startIndex: oldIndex, endIndex: newIndex }));
        }
    };

    return (
        <div
            className="flex-1 overflow-y-auto bg-white px-4 py-12 sm:px-6 lg:px-8"
            onClick={() => dispatch(selectItem(null))}
        >
            <div className="mx-auto max-w-2xl space-y-8">
                {/* Form Header */}
                <div
                    onClick={(e) => { e.stopPropagation(); dispatch(selectItem(null)); }}
                    className={`group relative overflow-hidden rounded-xl border transition-all duration-300 cursor-pointer ${selectedId === null
                        ? 'border-brand-500 bg-white shadow-lg ring-4 ring-brand-50'
                        : 'border-neutral-200 bg-white/50 hover:border-brand-200 hover:bg-white hover:shadow-md'
                        }`}
                >
                    {/* Decorative top accent */}
                    <div className={`absolute top-0 left-0 right-0 h-1.5 transition-colors duration-300 ${selectedId === null ? 'bg-brand-500' : 'bg-transparent group-hover:bg-brand-200'}`} />

                    <div className="p-8 sm:p-10">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => dispatch(setTitle(e.target.value))}
                            className="w-full bg-transparent text-4xl font-extrabold tracking-tight text-neutral-900 placeholder-neutral-300 focus:outline-none transition-colors"
                            placeholder="Untitled Form"
                        />
                        <div className="mt-4 flex items-start gap-2">
                            <textarea
                                value={description}
                                onChange={(e) => dispatch(setDescription(e.target.value))}
                                className="w-full resize-none bg-transparent text-lg text-neutral-600 placeholder-neutral-400 focus:outline-none transition-colors"
                                placeholder="Add a description to your form..."
                                rows={2}
                            />
                        </div>
                    </div>
                </div>

                {/* Questions List */}
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={questions.map(q => q.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-4">
                            {questions.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center text-neutral-400">
                                    <p>Click a question type on the left to add it to your form.</p>
                                </div>
                            ) : (
                                questions.map((q) => (
                                    <SortableQuestionItem
                                        key={q.id}
                                        question={q}
                                        isSelected={selectedId === q.id}
                                    />
                                ))
                            )}
                        </div>
                    </SortableContext>
                </DndContext>
            </div>
        </div>
    );
};
