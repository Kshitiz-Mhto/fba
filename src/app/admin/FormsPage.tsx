import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormTable } from './components/FormTable';
import type { RootState } from '../../store/store';
import { adminAPI } from '../../services/api';
import { Search, Filter } from 'lucide-react';
import { setForms, setLoading, setError, removeForm } from '../../store/slices/adminSlice';
import { Loader } from '../../components/ui/Loader';

const FormsPage: React.FC = () => {
    const dispatch = useDispatch();
    const { forms, loading } = useSelector((state: RootState) => state.admin);
    const [searchQuery, setSearchQuery] = React.useState('');

    const fetchForms = async () => {
        dispatch(setLoading(true));
        try {
            const data = await adminAPI.getAllForms();
            dispatch(setForms(data.forms));
        } catch (err) {
            dispatch(setError('Failed to fetch forms'));
        } finally {
            dispatch(setLoading(false));
        }
    };

    useEffect(() => {
        fetchForms();
    }, []);

    const handleDeleteForm = async (id: string) => {
        try {
            await adminAPI.deleteForm(id);
            dispatch(removeForm(id));
        } catch (err) {
            console.error('Failed to delete form', err);
        }
    };

    const filteredForms = forms.filter(form =>
        form.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 relative min-h-[400px]">
            {loading && <Loader variant="overlay" text="Fetching forms..." />}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">Form Management</h1>
                    <p className="text-sm text-neutral-500">View and manage all forms created across the platform.</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 max-w-md">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="h-4 w-4 text-neutral-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search forms by title..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full rounded-xl border border-neutral-200 pl-10 text-sm focus:border-brand-500 focus:ring-brand-500 py-2.5 bg-white shadow-sm"
                    />
                </div>
                <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-200 bg-white text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition-colors shadow-sm">
                    <Filter className="h-4 w-4" />
                    Filters
                </button>
            </div>

            <FormTable forms={filteredForms} onDelete={handleDeleteForm} />
        </div>
    );
};

export default FormsPage;
