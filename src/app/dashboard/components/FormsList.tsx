import React from 'react';
import { FileText, BarChart2, Copy, Archive } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { useDispatch } from 'react-redux';
import { deleteForm, duplicateForm, type Form } from '../../../store/slices/dashboardSlice';

interface FormsListProps {
    forms: Form[];
}

export const FormsList: React.FC<FormsListProps> = ({ forms }) => {
    const dispatch = useDispatch();

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

    return (
        <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-neutral-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                            Form Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                            Responses
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                            Last Updated
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Actions</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                    {forms.map((form) => (
                        <tr
                            key={form.id}
                            className="group hover:bg-neutral-50 transition-colors cursor-pointer"
                        >
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded bg-brand-50 text-brand-600">
                                        <FileText className="h-4 w-4" />
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-neutral-900 group-hover:text-brand-600 transition-colors">
                                            {form.title}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <StatusBadge status={form.status} />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-neutral-500 flex items-center gap-1.5 hover:text-neutral-900">
                                    <BarChart2 className="h-3.5 w-3.5" />
                                    {form.responses}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                                {form.lastUpdated}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        className="p-1.5 text-neutral-400 hover:text-brand-600 hover:bg-brand-50 rounded-md transition-colors"
                                        title="Edit"
                                    >
                                        <FileText className="h-4 w-4" />
                                    </button>
                                    <button
                                        className="p-1.5 text-neutral-400 hover:text-brand-600 hover:bg-brand-50 rounded-md transition-colors"
                                        title="View Responses"
                                    >
                                        <BarChart2 className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            dispatch(duplicateForm(form.id));
                                        }}
                                        className="p-1.5 text-neutral-400 hover:text-brand-600 hover:bg-brand-50 rounded-md transition-colors"
                                        title="Duplicate"
                                    >
                                        <Copy className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            dispatch(deleteForm(form.id));
                                        }}
                                        className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                        title="Archive"
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
    );
};
