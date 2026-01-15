import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: string;
        isUp: boolean;
    };
    color: 'brand' | 'blue' | 'green' | 'purple';
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, trend, color }) => {
    const colorClasses = {
        brand: 'bg-brand-50 text-brand-600',
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        purple: 'bg-purple-50 text-purple-600',
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
                    <Icon className="h-6 w-6" />
                </div>
                {trend && (
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend.isUp ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {trend.isUp ? '+' : '-'}{trend.value}
                    </span>
                )}
            </div>
            <h3 className="text-sm font-medium text-neutral-500 mb-1">{title}</h3>
            <p className="text-3xl font-bold text-neutral-900">{value}</p>
        </div>
    );
};
