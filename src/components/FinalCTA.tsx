import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/Button';
import { FadeIn } from './ui/FadeIn';

export const FinalCTA: React.FC = () => {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="bg-neutral-50 rounded-[2.5rem] p-12 md:p-20 lg:p-24 text-center border border-neutral-100 shadow-sm relative overflow-hidden">

                    <FadeIn>
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-neutral-900 mb-4 relative z-10">
                            Build <span className="text-brand-600">forms</span> people actually <br className="hidden md:block" />
                            want to<span className="text-brand-600"> Fill</span>
                        </h2>

                        <p className="text-xl text-neutral-500 mb-6 max-w-2xl mx-auto relative z-10">
                            Create surveys and quizzes that feel effortless — for you and for your respondents.<br></br>
                            <p>No clutter. No friction. Just clean, focused forms.
                            </p>
                        </p>

                        <div className="flex items-center justify-center relative z-10">
                            <Link to="/signup">
                                <Button
                                    size="lg"
                                    className="w-full sm:w-auto px-12 py-5 text-lg font-medium bg-brand-600 hover:bg-brand-700 shadow-xl shadow-brand-500/20 hover:scale-[1.04] transition-all duration-300"
                                >
                                    Create your first form
                                </Button>
                            </Link>
                        </div>


                        <p className="mt-8 text-sm text-neutral-400">
                            Free to start • No credit card required
                        </p>

                    </FadeIn>
                </div>
            </div>
        </section>
    );
};
