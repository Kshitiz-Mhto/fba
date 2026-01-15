import React, { useState } from 'react';
import { FileText, User, Calendar, ExternalLink, Trash2 } from 'lucide-react';
import type { AdminForm } from '../../../store/slices/adminSlice';
import { Link } from 'react-router-dom';
import { ConfirmModal } from '../../../components/ui/ConfirmModal';

interface FormTableProps {
    forms: AdminForm[];
    onDelete?: (id: string) => void;
}

export const FormTable: React.FC<FormTableProps> = ({ forms, onDelete }) => {
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; formId: string; formTitle: string }>({
        isOpen: false,
        formId: '',
        formTitle: '',
    });

    const handleDeleteClick = (form: AdminForm) => {
        setDeleteModal({
            isOpen: true,
            formId: form.id,
            formTitle: form.title || 'Untitled Form',
        });
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'published': return 'bg-green-50 text-green-700 border-green-100';
            case 'draft': return 'bg-neutral-100 text-neutral-700 border-neutral-200';
            case 'closed': return 'bg-red-50 text-red-700 border-red-100';
            default: return 'bg-neutral-100 text-neutral-700 border-neutral-200';
        }
    };

    return (
        <>
            <div className="overflow-x-auto bg-white rounded-2xl border border-neutral-200 shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-neutral-50/50 border-b border-neutral-200">
                            <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Form Name</th>
                            <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Created</th>
                            <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                        {forms.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-neutral-500">
                                    No forms found.
                                </td>
                            </tr>
                        ) : (
                            forms.map((form) => (
                                <tr key={form.id} className="hover:bg-neutral-50/50 transition-colors duration-150 group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 shadow-sm">
                                                <FileText className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold text-neutral-900">
                                                    {form.title || 'Untitled Form'}
                                                </div>
                                                <div className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
                                                    <User className="h-3 w-3" />
                                                    ID: {form.owner_id.substring(0, 8)}...
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(form.status)}`}>
                                            {form.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-neutral-600 flex items-center gap-1.5">
                                            <Calendar className="h-3.5 w-3.5 text-neutral-400" />
                                            {new Date(form.created_at).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-90 group-hover:opacity-100 transition-opacity">
                                            <Link
                                                to={`/preview/${form.id}`}
                                                className="p-2 text-neutral-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                                                title="Preview Form"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                            </Link>
                                            {onDelete && (
                                                <button
                                                    onClick={() => handleDeleteClick(form)}
                                                    className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete Form"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            )}
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
                onConfirm={() => onDelete && onDelete(deleteModal.formId)}
                title="Delete Form"
                description={
                    <>
                        Are you sure you want to delete <span className="font-semibold text-neutral-900">"{deleteModal.formTitle}"</span>?
                        This action cannot be undone and all responses will be permanently lost.
                    </>
                }
                confirmText="Delete Form"
                variant="danger"
            />
        </>
    );
};
