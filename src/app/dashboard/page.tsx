import React from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { FormsList } from './components/FormsList';
import { Stats } from './components/Stats';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { setSearchQuery, setStatusFilter, setDashboardData, setLoading } from '../../store/slices/dashboardSlice';
import { userAPI } from '../../services/api';
import { Loader } from '../../components/ui/Loader';

const DashboardPage: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { forms, searchQuery, statusFilter, loading } = useSelector((state: RootState) => state.dashboard);

    const [isCreating, setIsCreating] = React.useState(false);

    React.useEffect(() => {
        const fetchDashboardData = async () => {
            dispatch(setLoading(true));
            try {
                const data = await userAPI.getDashboardData();
                dispatch(setDashboardData(data));
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
                dispatch(setLoading(false));
            }
        };

        fetchDashboardData();
    }, [dispatch]);

    const handleCreateForm = async () => {
        if (isCreating) return;
        setIsCreating(true);
        try {
            const newForm = await userAPI.createForm({
                title: 'Untitled Form',
                description: '',
            });
            navigate(`/builder/${newForm.id}`);
        } catch (error) {
            console.error('Failed to create form:', error);
            alert('Failed to create form. Please try again.');
            setIsCreating(false);
        }
    };

    const filteredForms = (forms || []).filter((form) => {
        const matchesSearch = (form.title || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || form.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const firstName = user.first_name?.trim() || '';

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 relative min-h-[600px]">
            {loading && <Loader variant="overlay" text="Updating dashboard..." />}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">
                        Welcome{firstName && ` ${firstName}`}!
                    </h1>

                    <p className="mt-1.5 text-neutral-500">
                        Here's what's happening with your forms.
                    </p>
                </div>
                <button
                    onClick={handleCreateForm}
                    disabled={isCreating}
                    className="inline-flex items-center justify-center rounded-xl bg-[#4338CA] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isCreating ? (
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                        <Plus className="mr-2 h-4 w-4" />
                    )}
                    {isCreating ? 'Creating...' : 'Create New Form'}
                </button>
            </div>

            <Stats forms={forms} />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h2 className="text-xl font-bold text-neutral-900">Your Forms</h2>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative min-w-[300px]">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Search className="h-4 w-4 text-neutral-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search forms..."
                                className="block w-full rounded-xl border-neutral-200 pl-10 text-sm focus:border-brand-500 focus:ring-brand-500 py-2.5 bg-white shadow-sm transition-all"
                                value={searchQuery}
                                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                            />
                        </div>

                        <div className="relative">
                            <select
                                className="block w-full appearance-none rounded-xl border-neutral-200 bg-white py-2.5 pl-4 pr-10 text-sm focus:border-brand-500 focus:outline-none focus:ring-brand-500 shadow-sm transition-all"
                                value={statusFilter}
                                onChange={(e) => dispatch(setStatusFilter(e.target.value))}
                            >
                                <option value="all">All Status</option>
                                <option value="published">Published</option>
                                <option value="draft">Draft</option>
                                <option value="closed">Closed</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-neutral-400">
                                <Filter className="h-4 w-4" />
                            </div>
                        </div>
                    </div>
                </div>

                <FormsList forms={filteredForms} />
            </div>
        </div>
    );
};

export default DashboardPage;
