import React from 'react';
import { LayoutTemplate, Trophy, Link as LinkIcon, BarChart3, ArrowRight } from 'lucide-react';
import { FadeIn } from './ui/FadeIn';

export const Features: React.FC = () => {
    return (
        <section id="features" className="py-32 bg-neutral-25">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <FadeIn className="mb-20 md:text-center max-w-3xl md:mx-auto">
                    <h2 className="text-lg font-semibold text-brand-600 uppercase tracking-widest mb-2">Features</h2>
                    <h3 className="text-6xl md:text-6xl font-bold tracking-tight text-neutral-900 mb-6">
                        Everything you <span className="text-brand-600">need</span>. <br />
                        Nothing you <span className="text-brand-600">don't</span>.
                    </h3>
                    <p className="text-xl text-neutral-500 font-light">
                        We stripped away the enterprise bloat to give you a tool that respects your time and your users' attention.
                    </p>
                </FadeIn>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Feature 1: Powerful Form Builder */}
                    <FadeIn delay={100} className="md:col-span-2 bg-white rounded-3xl border border-neutral-200 p-8 md:p-10 relative overflow-hidden group hover:shadow-xl hover:border-brand-100 transition-all duration-500">
                        <div className="relative z-10 max-w-md">
                            <div className="w-12 h-12 bg-neutral-100 rounded-2xl flex items-center justify-center text-neutral-900 mb-6 group-hover:bg-brand-600 group-hover:text-white transition-colors duration-300">
                                <LayoutTemplate size={24} />
                            </div>
                            <h4 className="text-2xl font-bold text-neutral-900 mb-4">Powerful form builder</h4>
                            <p className="text-neutral-500 text-lg leading-relaxed mb-8">
                                Experience an editor that flows like a document. Slash commands, rich text, and drag-and-drop make building forms feel like magic.
                            </p>
                            <div className="flex items-center text-sm font-semibold text-brand-600 cursor-pointer group/link">
                                <span>Try the demo</span>
                                <ArrowRight size={16} className="ml-2 group-hover/link:translate-x-1 transition-transform" />
                            </div>
                        </div>

                        {/* Abstract UI Decoration */}
                        <div className="absolute right-[-40px] top-[20%] md:right-0 md:top-12 w-[350px] bg-white rounded-l-xl shadow-lg border border-neutral-100 p-4 rotate-[-3deg] group-hover:rotate-0 group-hover:translate-x-2 transition-all duration-500 ease-out">
                            <div className="space-y-4 opacity-50 group-hover:opacity-100 transition-opacity">
                                <div className="h-4 w-1/3 bg-neutral-200 rounded-full"></div>
                                <div className="h-10 w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 flex items-center text-xs text-neutral-400">
                                    Type your answer...
                                </div>
                                <div className="flex items-center gap-2 pt-2">
                                    <div className="px-3 py-1 bg-brand-50 text-brand-600 text-xs rounded-md border border-brand-100">/text</div>
                                    <div className="px-3 py-1 bg-neutral-50 text-neutral-500 text-xs rounded-md border border-neutral-100">/rating</div>
                                    <div className="px-3 py-1 bg-neutral-50 text-neutral-500 text-xs rounded-md border border-neutral-100">/date</div>
                                </div>
                            </div>
                        </div>
                    </FadeIn>

                    {/* Feature 2: Quiz Support */}
                    <FadeIn delay={200} className="md:col-span-1 bg-white rounded-3xl border border-neutral-200 p-8 relative overflow-hidden group hover:shadow-xl hover:border-brand-100 transition-all duration-500">
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-amber-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Trophy size={24} />
                            </div>
                            <h4 className="text-xl font-bold text-neutral-900 mb-3">Quiz & scoring</h4>
                            <p className="text-neutral-500 text-base leading-relaxed">
                                Turn forms into quizzes. Assign points, set logic, and show custom results based on scores.
                            </p>
                        </div>

                        {/* Score Decoration */}
                        <div className="absolute bottom-6 right-6">
                            <div className="w-16 h-16 rounded-full border-4 border-amber-200 flex items-center justify-center text-amber-700 font-bold text-lg bg-white shadow-sm group-hover:scale-110 transition-transform duration-500">
                                A+
                            </div>
                        </div>
                    </FadeIn>

                    {/* Feature 3: Shareable Links */}
                    <FadeIn delay={300} className="md:col-span-1 bg-white rounded-3xl border border-neutral-200 p-8 relative overflow-hidden group hover:shadow-xl hover:border-brand-100 transition-all duration-500">
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                                <LinkIcon size={24} />
                            </div>
                            <h4 className="text-xl font-bold text-neutral-900 mb-3">Public shareable links</h4>
                            <p className="text-neutral-500 text-base leading-relaxed mb-6">
                                Custom domains, QR codes, and beautiful previews. Share anywhere with confidence.
                            </p>

                            <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3 flex items-center gap-3 overflow-hidden group-hover:bg-white group-hover:shadow-sm transition-all">
                                <div className="w-8 h-8 bg-white border border-neutral-100 rounded flex items-center justify-center shrink-0 text-brand-600">
                                    <span className="text-xs font-bold">cr</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="h-2 w-16 bg-neutral-200 rounded-full mb-1.5"></div>
                                    <div className="h-1.5 w-24 bg-neutral-100 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </FadeIn>

                    {/* Feature 4: Analytics */}
                    <FadeIn delay={400} className="md:col-span-2 bg-neutral-900 rounded-3xl border border-neutral-800 p-8 md:p-10 relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
                        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                            <div className="flex-1">
                                <div className="w-12 h-12 bg-neutral-800 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:bg-brand-500 transition-colors duration-300">
                                    <BarChart3 size={24} />
                                </div>
                                <h4 className="text-2xl font-bold text-white mb-4">Clean response analytics</h4>
                                <p className="text-neutral-400 text-lg leading-relaxed">
                                    Visualize data instantly. Track completion rates, drop-offs, and export to CSV or Notion with one click.
                                </p>
                            </div>

                            {/* Chart Visual */}
                            <div className="w-full md:w-1/2 h-40 flex items-end justify-between gap-2 px-4 pb-2 border-b border-neutral-800">
                                {[40, 70, 45, 90, 65, 85, 50, 95].map((height, i) => (
                                    <div
                                        key={i}
                                        className="w-full bg-neutral-800 hover:bg-brand-500 transition-all duration-300 rounded-t-sm relative group/bar"
                                        style={{ height: `${height}%` }}
                                    >
                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-white opacity-0 group-hover/bar:opacity-100 transition-opacity">
                                            {height}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
};