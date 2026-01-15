import React from 'react';
import { FileText, CheckCircle, Clock, BarChart3 } from 'lucide-react';
import { type Form } from '../../../store/slices/dashboardSlice';

interface StatsProps {
    forms: Form[];
}

export const Stats: React.FC<StatsProps> = ({ forms }) => {
    const safeForms = forms || [];
    const totalForms = safeForms.length;
    const activeForms = safeForms.filter(f => f.status === 'published').length;
    const draftForms = safeForms.filter(f => f.status === 'draft').length;
    const totalResponses = safeForms.reduce((acc, f) => acc + (f.responses || 0), 0);

    const stats = [
        {
            label: 'Total Forms',
            value: totalForms,
            icon: FileText,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
        },
        {
            label: 'Active Forms',
            value: activeForms,
            icon: CheckCircle,
            color: 'text-green-600',
            bg: 'bg-green-50',
        },
        {
            label: 'Draft Forms',
            value: draftForms,
            icon: Clock,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
        },
        {
            label: 'Total Responses',
            value: totalResponses,
            icon: BarChart3,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
                >
                    <div className="flex items-center gap-4">
                        <div className={`rounded-xl ${stat.bg} p-3`}>
                            <stat.icon className={`h-6 w-6 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-neutral-500">{stat.label}</p>
                            <p className="text-2xl font-bold text-neutral-900">{stat.value}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
