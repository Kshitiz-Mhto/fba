import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userAPI } from '../../../services/api';
import { Loader } from '../../../components/ui/Loader';
import { ArrowLeft, Download, Calendar, Eye } from 'lucide-react';
import { SubmissionDetailModal } from './SubmissionDetailModal';

interface Answer {
    id: string;
    question_id: string;
    value: any;
    created_at: string;
}

interface Submission {
    id: string;
    form_id: string;
    respondent_email?: string;
    created_at: string;
    answers: Answer[];
}

interface Question {
    id: string;
    title: string;
    type: string;
    description?: string;
    emoji?: string;
    position: number;
    required: boolean;
    options?: any[];
}

interface Form {
    id: string;
    title: string;
    questions?: Question[];
}

const FormResponsesPage: React.FC = () => {
    const { formId } = useParams<{ formId: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [form, setForm] = useState<Form | null>(null);
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!formId) return;
            try {
                const [formData, submissionsData] = await Promise.all([
                    userAPI.getForm(formId),
                    userAPI.getFormSubmissions(formId)
                ]);
                setForm(formData);
                setSubmissions(submissionsData);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [formId]);

    if (loading) {
        return <Loader variant="full" text="Loading responses..." />;
    }

    if (!form) {
        return <div>Form not found</div>;
    }

    const questions = form.questions || [];

    const safeSubmissions = submissions || [];

    const handleExportCSV = () => {
        if (!form || safeSubmissions.length === 0) return;

        const headers = [
            'Submission Date',
            'Respondent Email',
            'Respondent ID',
            ...questions.map(q => q.title || 'Untitled Question')
        ];

        const rows = safeSubmissions.map(submission => {
            const rowData = [
                new Date(submission.created_at).toLocaleString(),
                submission.respondent_email || 'Anonymous',
                submission.id,
                ...questions.map(q => {
                    const answer = submission.answers?.find(a => a.question_id === q.id);
                    if (!answer || answer.value === null || answer.value === undefined) return '';

                    if (Array.isArray(answer.value)) {
                        return answer.value.join('; '); // Use semicolon for multi-select
                    } else if (typeof answer.value === 'object') {
                        return JSON.stringify(answer.value).replace(/"/g, '""'); // Escape quotes
                    }
                    return String(answer.value).replace(/"/g, '""'); // Escape quotes
                })
            ];

            return rowData.map(field => {
                const stringField = String(field);
                if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
                    return `"${stringField}"`;
                }
                return stringField;
            }).join(',');
        });

        const csvContent = [
            headers.join(','),
            ...rows
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `${form.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_responses.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5 text-neutral-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900">{form.title}</h1>
                        <p className="text-neutral-500 text-sm">
                            {safeSubmissions.length} {safeSubmissions.length === 1 ? 'response' : 'responses'}
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleExportCSV}
                    disabled={safeSubmissions.length === 0}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Download className="h-4 w-4" />
                    Export CSV
                </button>
            </div>

            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-neutral-50 border-b border-neutral-200">
                                <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider w-1/4">
                                    Submission Date
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider w-1/4">
                                    Respondent
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider w-1/4">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider w-1/4 text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {safeSubmissions.map((submission) => (
                                <tr
                                    key={submission.id}
                                    className="hover:bg-neutral-50/50 transition-colors cursor-pointer"
                                    onClick={() => setSelectedSubmission(submission)}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-neutral-400" />
                                            {new Date(submission.created_at).toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                                        {submission.respondent_email || 'Anonymous'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Completed
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedSubmission(submission);
                                            }}
                                            className="text-orange-600 hover:text-orange-700 font-medium inline-flex items-center gap-1"
                                        >
                                            <Eye className="h-4 w-4" />
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {safeSubmissions.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="text-neutral-400 text-5xl">📝</div>
                                            <div>
                                                <p className="text-neutral-900 font-semibold">No responses yet</p>
                                                <p className="text-neutral-500 text-sm mt-1">
                                                    Share your form to start collecting responses
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <SubmissionDetailModal
                isOpen={!!selectedSubmission}
                onClose={() => setSelectedSubmission(null)}
                submission={selectedSubmission}
                questions={questions}
                formTitle={form.title}
            />
        </div>
    );
};

export default FormResponsesPage;
