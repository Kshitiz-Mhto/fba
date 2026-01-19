import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, ChevronLeft, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { RootState } from '../../store/store';

const PreviewPage: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            navigate('/login');
        }
    }, [navigate]);

    const { title, description, questions } = useSelector((state: RootState) => state.form);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [direction, setDirection] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
    const [error, setError] = useState<string | null>(null);

    const handleNext = () => {
        if (currentIndex >= 0 && currentIndex < questions.length) {
            const currentQuestion = questions[currentIndex];
            const answer = answers[currentQuestion.id];

            if (currentQuestion.required) {
                if (!answer || (Array.isArray(answer) && answer.length === 0)) {
                    setError('This question is required');
                    return;
                }
            }
        }

        setError(null);
        setDirection(1);
        setCurrentIndex((prev) => Math.min(prev + 1, questions.length));
    };

    const handlePrev = () => {
        setError(null);
        setDirection(-1);
        setCurrentIndex((prev) => Math.max(prev - 1, -1));
    };

    const handleAnswer = (value: string | string[]) => {
        if (currentIndex >= 0 && currentIndex < questions.length) {
            const currentQuestion = questions[currentIndex];
            setAnswers((prev) => ({
                ...prev,
                [currentQuestion.id]: value,
            }));
            if (error) setError(null);
        }
    };

    const variants = {
        enter: (direction: number) => ({
            y: direction > 0 ? 50 : -50,
            opacity: 0,
        }),
        center: {
            zIndex: 1,
            y: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            zIndex: 0,
            y: direction < 0 ? 50 : -50,
            opacity: 0,
        }),
    };

    const currentQuestion = questions[currentIndex];
    const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;

    return (
        <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900 selection:bg-brand-200 selection:text-brand-900 flex flex-col">
            <div className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b border-neutral-200 bg-white/80 backdrop-blur-md px-4 shadow-sm">
                <div className="flex items-center gap-4">
                    <span className="rounded bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-700">
                        Preview Mode
                    </span>
                </div>

                {currentIndex >= 0 && currentIndex < questions.length && (
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-1">
                        {questions.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-1.5 w-8 rounded-full transition-colors duration-300 ${idx <= currentIndex ? 'bg-brand-600' : 'bg-neutral-200'
                                    }`}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div className="flex-1 flex items-center justify-center p-4 overflow-hidden relative">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                    {currentIndex === -1 ? (
                        <motion.div
                            key="welcome"
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="w-full max-w-3xl relative"
                        >
                            <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-brand-200 opacity-50 blur-3xl filter animate-pulse" />
                            <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-blue-200 opacity-50 blur-3xl filter animate-pulse delay-1000" />

                            <div className="relative overflow-hidden rounded-3xl border border-white/50 bg-white/40 p-12 shadow-2xl backdrop-blur-xl sm:p-16">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-xl shadow-lg shadow-brand-200">
                                        <img
                                            src="/assets/craft_logo.png"
                                            alt="Logo"
                                            className="w-12 h-12 rounded-xl object-contain scale-150"
                                        />
                                    </div>
                                    <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-6xl">
                                        {title}
                                    </h1>
                                </motion.div>

                                {description && (
                                    <motion.p
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="mb-6 max-w-xl text-xl leading-relaxed text-neutral-600"
                                    >
                                        {description}
                                    </motion.p>
                                )}

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    <button
                                        onClick={handleNext}
                                        className="group relative inline-flex items-center gap-3 overflow-hidden rounded-xl bg-neutral-900 px-10 py-5 text-lg font-bold text-white shadow-xl"
                                    >
                                        <span className="relative z-10">Let's Get Started</span>
                                        <ChevronRight className="relative z-10 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                        <div className="absolute inset-0 -z-0 bg-brand-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                    </button>
                                    <p className="mt-6 text-sm font-medium text-neutral-400">
                                        Takes about {Math.max(1, Math.ceil(questions.length * 0.5))} minutes
                                    </p>
                                </motion.div>
                            </div>
                        </motion.div>
                    ) : currentIndex === questions.length ? (
                        <motion.div
                            key="completion"
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="w-full max-w-2xl text-center"
                        >
                            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
                                <Check className="h-10 w-10" />
                            </div>
                            <h2 className="text-3xl font-bold text-neutral-900 mb-4">All done!</h2>
                            <p className="text-neutral-500 mb-8">
                                Thanks for filling out the form.
                            </p>
                            <button
                                onClick={() => {
                                    setAnswers({});
                                    setCurrentIndex(-1);
                                }}
                                className="text-sm font-medium text-brand-600 hover:text-brand-700 underline"
                            >
                                Submit another response
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key={currentQuestion.id}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="w-full max-w-2xl"
                        >
                            <div className="bg-white rounded-2xl shadow-xl border border-neutral-100 p-8 sm:p-12">
                                <div className="mb-8">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                                            {currentIndex + 1}
                                        </span>
                                        <span className="text-sm font-medium text-neutral-400 uppercase tracking-wider">
                                            Question {currentIndex + 1} of {questions.length}
                                        </span>
                                    </div>

                                    <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 flex items-start gap-3">
                                        {currentQuestion.emoji && <span className="text-3xl sm:text-4xl leading-none">{currentQuestion.emoji}</span>}
                                        <span>
                                            {currentQuestion.title}
                                            {currentQuestion.required && <span className="text-red-500 ml-1">*</span>}
                                        </span>
                                    </h2>
                                    {currentQuestion.description && (
                                        <p className="mt-3 text-lg text-neutral-500 leading-relaxed">
                                            {currentQuestion.description}
                                        </p>
                                    )}
                                </div>

                                <div className="mb-10">
                                    {currentQuestion.type === 'short-text' && (
                                        <input
                                            type="text"
                                            value={currentAnswer as string || ''}
                                            onChange={(e) => handleAnswer(e.target.value)}
                                            className="block w-full border-0 border-b-2 border-neutral-200 bg-transparent py-3 text-xl text-neutral-900 placeholder:text-neutral-300 focus:border-brand-600 focus:ring-0 transition-colors"
                                            placeholder="Type your answer here..."
                                            autoFocus
                                        />
                                    )}
                                    {currentQuestion.type === 'long-text' && (
                                        <textarea
                                            rows={3}
                                            value={currentAnswer as string || ''}
                                            onChange={(e) => handleAnswer(e.target.value)}
                                            className="block w-full resize-none border-0 border-b-2 border-neutral-200 bg-transparent py-3 text-xl text-neutral-900 placeholder:text-neutral-300 focus:border-brand-600 focus:ring-0 transition-colors"
                                            placeholder="Type your answer here..."
                                            autoFocus
                                        />
                                    )}
                                    {(currentQuestion.type === 'single-select') && (
                                        <div className="space-y-3">
                                            {currentQuestion.options?.map((option, idx) => (
                                                <label
                                                    key={idx}
                                                    onClick={() => handleAnswer(option)}
                                                    className={`flex cursor-pointer items-center rounded-lg border-2 p-4 transition-all group ${currentAnswer === option
                                                        ? 'border-brand-500 bg-brand-50'
                                                        : 'border-neutral-100 bg-neutral-50 hover:border-brand-200 hover:bg-brand-50'
                                                        }`}
                                                >
                                                    <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors ${currentAnswer === option
                                                        ? 'border-brand-500'
                                                        : 'border-neutral-300 group-hover:border-brand-500'
                                                        }`}>
                                                        {currentAnswer === option && (
                                                            <div className="h-3 w-3 rounded-full bg-brand-600" />
                                                        )}
                                                    </div>
                                                    <span className={`ml-4 text-lg font-medium ${currentAnswer === option ? 'text-brand-900' : 'text-neutral-700 group-hover:text-neutral-900'
                                                        }`}>
                                                        {option}
                                                    </span>
                                                    <span className="ml-auto text-xs font-bold text-neutral-300 group-hover:text-brand-400">
                                                        KEY {String.fromCharCode(65 + idx)}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                    {(currentQuestion.type === 'multi-select') && (
                                        <div className="space-y-3">
                                            {currentQuestion.options?.map((option, idx) => {
                                                const isSelected = (currentAnswer as string[] || []).includes(option);
                                                return (
                                                    <label
                                                        key={idx}
                                                        onClick={() => {
                                                            const current = (currentAnswer as string[] || []);
                                                            if (isSelected) {
                                                                handleAnswer(current.filter(a => a !== option));
                                                            } else {
                                                                handleAnswer([...current, option]);
                                                            }
                                                        }}
                                                        className={`flex cursor-pointer items-center rounded-lg border-2 p-4 transition-all group ${isSelected
                                                            ? 'border-brand-500 bg-brand-50'
                                                            : 'border-neutral-100 bg-neutral-50 hover:border-brand-200 hover:bg-brand-50'
                                                            }`}
                                                    >
                                                        <div className={`flex h-6 w-6 items-center justify-center rounded border-2 transition-colors ${isSelected
                                                            ? 'border-brand-500 bg-brand-500'
                                                            : 'border-neutral-300 group-hover:border-brand-500'
                                                            }`}>
                                                            {isSelected && (
                                                                <Check className="h-4 w-4 text-white" />
                                                            )}
                                                        </div>
                                                        <span className={`ml-4 text-lg font-medium ${isSelected ? 'text-brand-900' : 'text-neutral-700 group-hover:text-neutral-900'
                                                            }`}>
                                                            {option}
                                                        </span>
                                                        <span className="ml-auto text-xs font-bold text-neutral-300 group-hover:text-brand-400">
                                                            KEY {String.fromCharCode(65 + idx)}
                                                        </span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    )}
                                    {currentQuestion.type === 'dropdown' && (
                                        <select
                                            value={currentAnswer as string || ''}
                                            onChange={(e) => handleAnswer(e.target.value)}
                                            className="block w-full rounded-lg border-2 border-neutral-200 bg-white px-4 py-3 text-xl text-neutral-900 focus:border-brand-500 focus:outline-none focus:ring-0 transition-colors"
                                        >
                                            <option value="">Select an option...</option>
                                            {currentQuestion.options?.map((option, idx) => (
                                                <option key={idx} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>

                                {error && (
                                    <div className="mb-6 flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-600">
                                        <AlertCircle className="h-4 w-4" />
                                        {error}
                                    </div>
                                )}

                                <div className="flex items-center justify-between pt-6 border-t border-neutral-100">
                                    <button
                                        onClick={handlePrev}
                                        className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        Previous
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        className="flex items-center gap-2 rounded-md bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-brand-700 hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                                    >
                                        {currentIndex === questions.length - 1 ? 'Submit' : 'Next'}
                                        {currentIndex !== questions.length - 1 && <ChevronRight className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default PreviewPage;
