import React from 'react';
import { FileText, BarChart2, Copy, Archive, DraftingCompass, View } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { useDispatch } from 'react-redux';
import { deleteForm, duplicateForm, updateFormStatus, type Form } from '../../../store/slices/dashboardSlice';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../../../services/api';
import { ConfirmModal } from '../../../components/ui/ConfirmModal';

interface FormsListProps {
    forms: Form[];
}

export const FormsList: React.FC<FormsListProps> = ({ forms }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [deleteModal, setDeleteModal] = React.useState<{ isOpen: boolean; formId: string; formTitle: string }>({
        isOpen: false,
        formId: '',
        formTitle: '',
    });

    if (forms.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-4 rounded-full bg-neutral-100 p-4">
                    <FileText className="h-8 w-8 text-neutral-400" />
                </div>
                <h3 className="text-lg font-medium text-neutral-900">No forms yet</h3>
                <p className="mt-1 text-sm text-neutral-500">Create your first form to get started.</p>
            </div>
        );
    }

    const handleDeleteClick = (e: React.MouseEvent, form: Form) => {
        e.stopPropagation();
        setDeleteModal({
            isOpen: true,
            formId: form.id,
            formTitle: form.title,
        });
    };

    const handleConfirmDelete = async () => {
        try {
            await userAPI.deleteForm(deleteModal.formId);
            dispatch(deleteForm(deleteModal.formId));
            setDeleteModal({ ...deleteModal, isOpen: false });
        } catch (error) {
            console.error('Failed to delete form:', error);
        }
    };

    return (
        <>
            <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-neutral-100 bg-neutral-50/50">
                                <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Form Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Responses</th>
                                <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Last Updated</th>
                                <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {forms.map((form) => (
                                <tr
                                    key={form.id}
                                    onClick={() => navigate(`/builder/${form.id}`)}
                                    className="group hover:bg-neutral-50/50 transition-colors cursor-pointer"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-lg bg-brand-50 p-2 text-brand-600 group-hover:bg-brand-100 transition-colors">
                                                <FileText className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-neutral-900">{form.title}</p>
                                                <p className="text-xs text-neutral-500">{form.description || 'No description'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusBadge status={form.status} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-neutral-500 flex items-center gap-1.5 hover:text-neutral-900">
                                            <BarChart2 className="h-3.5 w-3.5" />
                                            {form.responses || 0}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                                        {form.updated_at ? new Date(form.updated_at).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end gap-2 opacity-90 group-hover:opacity-100 transition-opacity">
                                            {form.status === 'published' && (
                                                <button
                                                    onClick={async (e) => {
                                                        e.stopPropagation();
                                                        try {
                                                            await userAPI.unpublishForm(form.id);
                                                            dispatch(updateFormStatus({
                                                                id: form.id,
                                                                status: 'draft',
                                                                is_public: false
                                                            }));
                                                        } catch (error) {
                                                            console.error('Failed to unpublish form:', error);
                                                        }
                                                    }}
                                                    className="p-1.5 text-neutral-400 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                                                    title="Unpublish (Revert to Draft)">
                                                    <DraftingCompass className="h-4 w-4" />
                                                </button>
                                            )}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/dashboard/forms/${form.id}/responses`);
                                                }}
                                                className="p-1.5 text-neutral-400 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors"
                                                title="View all responses">
                                                <View className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={async (e) => {
                                                    e.stopPropagation();
                                                    try {
                                                        const newForm = await userAPI.duplicateForm(form.id);
                                                        dispatch(duplicateForm(newForm));
                                                    } catch (error) {
                                                        console.error('Failed to duplicate form:', error);
                                                    }
                                                }}
                                                className="p-1.5 text-neutral-400 hover:text-brand-600 hover:bg-brand-50 rounded-md transition-colors"
                                                title="Duplicate"
                                            >
                                                <Copy className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={(e) => handleDeleteClick(e, form)}
                                                className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                title="Delete"
                                            >
                                                <Archive className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
                onConfirm={handleConfirmDelete}
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
