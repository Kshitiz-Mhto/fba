import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const MainLayout: React.FC = () => {
    return (
        <div className="min-h-screen bg-white font-sans selection:bg-brand-200 selection:text-brand-900">
            <Navbar />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};
