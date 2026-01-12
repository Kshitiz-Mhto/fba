import React from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { FormsList } from './components/FormsList';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { setSearchQuery, setStatusFilter } from '../../store/slices/dashboardSlice';

const DashboardPage: React.FC = () => {
    const dispatch = useDispatch();
    const { forms, searchQuery, statusFilter } = useSelector((state: RootState) => state.dashboard);

    const filteredForms = forms.filter((form) => {
        const matchesSearch = form.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || form.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Your forms</h1>
                    <p className="mt-1 text-sm text-neutral-500">Manage your forms and view responses.</p>
                </div>
                <Link
                    to="/builder"
                    className="inline-flex items-center gap-2 rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-1 shadow-sm"
                >
                    <Plus className="h-4 w-4" />
                    <span>Create form</span>
                </Link>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 max-w-md border border-b rounded-lg">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="h-4 w-4 text-neutral-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search forms..."
                        className="block w-full rounded-md border-neutral-200 pl-10 text-sm focus:border-brand-500 focus:ring-brand-500 py-2"
                        value={searchQuery}
                        onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <select
                            className="block w-full appearance-none rounded-md border-neutral-200 bg-white py-2 pl-3 pr-8 text-sm focus:border-brand-500 focus:outline-none focus:ring-brand-500"
                            value={statusFilter}
                            onChange={(e) => dispatch(setStatusFilter(e.target.value))}
                        >
                            <option value="all">All Status</option>
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                            <option value="closed">Closed</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-500">
                            <Filter className="h-4 w-4" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Forms List */}
            <FormsList forms={filteredForms} />
        </div>
    );
};

export default DashboardPage;
