import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UserTable } from './components/UserTable';
import type { RootState } from '../../store/store';
import { setUsers, setLoading, setError, removeUser } from '../../store/slices/adminSlice';
import { Search, Filter } from 'lucide-react';
import { adminAPI } from '../../services/api';
import { Loader } from '../../components/ui/Loader';

const UsersPage: React.FC = () => {
    const dispatch = useDispatch();
    const { users, loading } = useSelector((state: RootState) => state.admin);
    const [searchQuery, setSearchQuery] = React.useState('');

    const fetchUsers = async () => {
        dispatch(setLoading(true));
        try {
            const data = await adminAPI.getAllUsers();
            dispatch(setUsers(data.users));
        } catch (err) {
            dispatch(setError('Failed to fetch users'));
        } finally {
            dispatch(setLoading(false));
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDeleteUser = async (id: string) => {
        try {
            await adminAPI.deleteUser(id);
            dispatch(removeUser(id));
        } catch (err) {
            console.error('Failed to delete user', err);
        }
    };

    const filteredUsers = users.filter(user =>
        user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 relative min-h-[400px]">
            {loading && <Loader variant="overlay" text="Fetching users..." />}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">User Management</h1>
                    <p className="text-sm text-neutral-500">Manage all registered users and their account status.</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 max-w-md">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="h-4 w-4 text-neutral-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
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

            <UserTable
                users={filteredUsers}
                onDelete={handleDeleteUser}
                onViewForms={(id) => console.log('View forms for', id)}
            />
        </div>
    );
};

export default UsersPage;
