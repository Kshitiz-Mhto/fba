import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Users, FileText, LayoutDashboard, LogOut } from 'lucide-react';
import { useEffect } from 'react';

export const AdminLayout: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            if (user.role !== 'admin') {
                navigate('/dashboard');
            }
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const navItems = [
        { path: '/admin', icon: LayoutDashboard, label: 'Overview' },
        { path: '/admin/users', icon: Users, label: 'Users' },
        { path: '/admin/forms', icon: FileText, label: 'Forms' },
    ];

    return (
        <div className="flex h-screen bg-neutral-50 font-sans text-neutral-900">
            <aside className="w-64 border-r border-neutral-200 bg-white flex flex-col">
                <div className="p-6 flex items-center border-b border-neutral-100">
                    <Link
                        to="/admin"
                        className="flex items-center cursor-pointer"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                        <img
                            src="/assets/craft_logo.png"
                            alt="Logo"
                            className="w-12 h-12 rounded-xl object-contain"
                        />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-neutral-900">Admin</h1>
                        <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">Control Panel</p>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                    ? 'bg-brand-50 text-brand-700 shadow-sm'
                                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                                    }`}
                            >
                                <item.icon className={`h-5 w-5 ${isActive ? 'text-brand-600' : 'text-neutral-400'}`} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-neutral-100">
                    <Link
                        to="/dashboard"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-all duration-200"
                    >
                        <LogOut className="h-5 w-5 text-neutral-400" />
                        Back to App
                    </Link>
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto">
                <header className="h-16 border-b border-neutral-200 bg-white/80 backdrop-blur-md sticky top-0 z-10 px-8 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-neutral-800">
                        {navItems.find(item => item.path === location.pathname)?.label || 'Admin'}
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-xs shadow-sm">
                            AD
                        </div>
                    </div>
                </header>

                <div className="p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
