import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Users, FileText, TrendingUp, Activity } from 'lucide-react';
import { StatsCard } from './components/StatsCard';
import { UserTable } from './components/UserTable';
import { FormTable } from './components/FormTable';
import type { RootState } from '../../store/store';
import { adminAPI } from '../../services/api';
import { setUsers, setForms, setPublishedCount, setLoading, setError, removeUser } from '../../store/slices/adminSlice';
import { Loader } from '../../components/ui/Loader';

const AdminOverview: React.FC = () => {
    const dispatch = useDispatch();
    const { users, forms, publishedCount, loading } = useSelector((state: RootState) => state.admin);

    const fetchData = async () => {
        dispatch(setLoading(true));
        try {
            const usersData = await adminAPI.getAllUsers();
            dispatch(setUsers(usersData.users));

            const formsData = await adminAPI.getAllForms();
            dispatch(setForms(formsData.forms));

            const countData = await adminAPI.getPublishedFormsCount();
            dispatch(setPublishedCount(countData.count));

        } catch (err) {
            dispatch(setError('Failed to fetch admin data'));
        } finally {
            dispatch(setLoading(false));
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDeleteUser = async (id: string) => {
        try {
            await adminAPI.deleteUser(id);
            dispatch(removeUser(id));
        } catch (err) {
            console.error('Failed to delete user', err);
        }
    };

    if (loading && users.length === 0) {
        return <Loader variant="full" text="Loading admin dashboard..." />;
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Users"
                    value={users.length}
                    icon={Users}
                    color="brand"
                    trend={{ value: '12%', isUp: true }}
                />
                <StatsCard
                    title="Total Forms"
                    value={forms.length}
                    icon={FileText}
                    color="blue"
                    trend={{ value: '8%', isUp: true }}
                />
                <StatsCard
                    title="Published Forms"
                    value={publishedCount}
                    icon={Activity}
                    color="green"
                />
                <StatsCard
                    title="Growth"
                    value="+24%"
                    icon={TrendingUp}
                    color="purple"
                    trend={{ value: '4%', isUp: true }}
                />
            </div>

            <div className="flex flex-col gap-8">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-neutral-900">Recent Users</h3>
                        <button className="text-sm font-medium text-brand-600 hover:text-brand-700">View all</button>
                    </div>
                    <UserTable
                        users={users.slice(0, 5)}
                        onDelete={handleDeleteUser}
                        onViewForms={(id) => console.log('View forms for', id)}
                    />
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-neutral-900">Recent Forms</h3>
                        <button className="text-sm font-medium text-brand-600 hover:text-brand-700">View all</button>
                    </div>
                    <FormTable forms={forms.slice(0, 5)} />
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;
