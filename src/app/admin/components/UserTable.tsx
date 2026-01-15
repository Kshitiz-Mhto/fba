import React, { useState } from 'react';
import { Trash2, ExternalLink, Mail, Calendar, ShieldCheck, ShieldAlert } from 'lucide-react';
import type { AdminUser } from '../../../store/slices/adminSlice';
import { ConfirmModal } from '../../../components/ui/ConfirmModal';

interface UserTableProps {
    users: AdminUser[];
    onDelete: (id: string) => void;
    onViewForms: (id: string) => void;
}

export const UserTable: React.FC<UserTableProps> = ({ users, onDelete, onViewForms }) => {
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; userId: string; userName: string }>({
        isOpen: false,
        userId: '',
        userName: '',
    });

    const handleDeleteClick = (user: AdminUser) => {
        setDeleteModal({
            isOpen: true,
            userId: user.id,
            userName: `${user.first_name} ${user.last_name}`,
        });
    };

    return (
        <>
            <div className="overflow-x-auto bg-white rounded-2xl border border-neutral-200 shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-neutral-50/50 border-b border-neutral-200">
                            <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Joined</th>
                            <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                                    No users found.
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id} className="hover:bg-neutral-50/50 transition-colors duration-150 group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold shadow-sm">
                                                {user.first_name[0]}{user.last_name[0]}
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold text-neutral-900">
                                                    {user.first_name} {user.last_name}
                                                </div>
                                                <div className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
                                                    <Mail className="h-3 w-3" />
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${user.role === 'admin'
                                            ? 'bg-purple-50 text-purple-700 border-purple-100'
                                            : 'bg-blue-50 text-blue-700 border-blue-100'
                                            }`}>
                                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.is_verified ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                                                <ShieldCheck className="h-3 w-3" />
                                                Verified
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                                                <ShieldAlert className="h-3 w-3" />
                                                Pending
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-neutral-600 flex items-center gap-1.5">
                                            <Calendar className="h-3.5 w-3.5 text-neutral-400" />
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-90 group-hover:opacity-100 transition-opacity duration-200">
                                            <button
                                                onClick={() => onViewForms(user.id)}
                                                className="p-2 text-neutral-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all duration-200"
                                                title="View Forms"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(user)}
                                                className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                                                title="Delete User"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
                onConfirm={() => onDelete(deleteModal.userId)}
                title="Delete User"
                description={
                    <>
                        Are you sure you want to delete <span className="font-semibold text-neutral-900">"{deleteModal.userName}"</span>?
                        This action cannot be undone and the user will lose access to their account.
                    </>
                }
                confirmText="Delete User"
                variant="danger"
            />
        </>
    );
};
