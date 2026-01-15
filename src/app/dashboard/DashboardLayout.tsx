import { Outlet, Link, useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import { useEffect } from 'react';

export const DashboardLayout: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            navigate('/login');
            return;
        }

        const user = JSON.parse(userStr);
        if (user.role === 'admin') {
            navigate('/admin');
        }
    }, [navigate]);

    return (
        <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900 selection:bg-brand-200 selection:text-brand-900">
            <nav className="sticky top-0 z-50 h-14 border-b border-neutral-200 bg-white/80 backdrop-blur-md">
                <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-8">
                        <Link
                            to="/dashboard"
                            className="flex items-center cursor-pointer"
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        >
                            <img
                                src="/assets/craft_logo.png"
                                alt="Logo"
                                className="w-12 h-12 rounded-xl object-contain"
                            />
                            <span className="text-3xl font-bold tracking-tight text-neutral-900">
                                CrafT
                            </span>
                        </Link>

                    </div>

                    <div className="flex items-center gap-4">

                        <div className="h-8 w-8 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-300 transition-colors cursor-pointer">
                            <User className="h-4 w-4" />
                        </div>
                    </div>
                </div>
            </nav>

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <Outlet />
            </main>
        </div>
    );
};
