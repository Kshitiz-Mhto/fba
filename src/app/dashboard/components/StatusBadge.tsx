import React from 'react';

export type FormStatus = 'draft' | 'published' | 'closed';

interface StatusBadgeProps {
    status: FormStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const styles = {
        draft: 'bg-neutral-100 text-neutral-600 border-neutral-200',
        published: 'bg-brand-50 text-brand-700 border-brand-200',
        closed: 'bg-neutral-50 text-neutral-400 border-neutral-100',
    };

    const labels = {
        draft: 'Draft',
        published: 'Published',
        closed: 'Closed',
    };

    return (
        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${styles[status]}`}>
            {labels[status]}
        </span>
    );
};
