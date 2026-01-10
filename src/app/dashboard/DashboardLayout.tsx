import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Plus, User } from 'lucide-react';

export const DashboardLayout: React.FC = () => {
    return (
        <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900 selection:bg-brand-200 selection:text-brand-900">
            {/* Top Navigation Bar */}
            <nav className="sticky top-0 z-50 h-14 border-b border-neutral-200 bg-white/80 backdrop-blur-md">
                <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-8">
                        {/* Logo */}
                        <Link to="/dashboard" className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white font-bold">
                                F
                            </div>
                            <span className="text-lg font-bold tracking-tight text-neutral-900">FormCraft</span>
                        </Link>

                        {/* Navigation Links */}
                        <div className="hidden md:flex items-center gap-6">
                            <Link
                                to="/dashboard"
                                className="text-sm font-medium text-neutral-900 hover:text-brand-600 transition-colors"
                            >
                                Forms
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* New Form CTA */}
                        <button className="inline-flex items-center gap-2 rounded-md bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-1">
                            <Plus className="h-4 w-4" />
                            <span>New form</span>
                        </button>

                        {/* User Avatar */}
                        <div className="h-8 w-8 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-300 transition-colors cursor-pointer">
                            <User className="h-4 w-4" />
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <Outlet />
            </main>
        </div>
    );
};
