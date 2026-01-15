import React from 'react';
import { AlertTriangle, X, Info, AlertCircle } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger',
}) => {
    if (!isOpen) return null;

    const getVariantStyles = () => {
        switch (variant) {
            case 'danger':
                return {
                    icon: AlertTriangle,
                    iconBg: 'bg-red-50',
                    iconColor: 'text-red-600',
                    confirmBg: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
                };
            case 'warning':
                return {
                    icon: AlertCircle,
                    iconBg: 'bg-amber-50',
                    iconColor: 'text-amber-600',
                    confirmBg: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500',
                };
            case 'info':
                return {
                    icon: Info,
                    iconBg: 'bg-blue-50',
                    iconColor: 'text-blue-600',
                    confirmBg: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
                };
            default:
                return {
                    icon: AlertTriangle,
                    iconBg: 'bg-red-50',
                    iconColor: 'text-red-600',
                    confirmBg: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
                };
        }
    };

    const styles = getVariantStyles();
    const Icon = styles.icon;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div
                className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-2xl transition-all animate-in fade-in zoom-in duration-200">
                <div className="absolute right-4 top-4">
                    <button
                        onClick={onClose}
                        className="rounded-full p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex flex-col items-center text-center">
                    <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${styles.iconBg} ${styles.iconColor}`}>
                        <Icon className="h-6 w-6" />
                    </div>

                    <h3 className="text-xl font-bold text-neutral-900">{title}</h3>
                    <div className="mt-2 text-sm text-neutral-500">
                        {description}
                    </div>
                </div>

                <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:justify-center">
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors sm:flex-none sm:px-6"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all active:scale-[0.98] sm:flex-none sm:px-6 ${styles.confirmBg}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};
