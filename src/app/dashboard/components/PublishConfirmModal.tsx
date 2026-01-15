import React from 'react';
import { Share2, X, Copy, ExternalLink } from 'lucide-react';

interface PublishConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    formTitle: string;
    publishUrl: string;
}

export const PublishConfirmModal: React.FC<PublishConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    formTitle,
    publishUrl,
}) => {
    if (!isOpen) return null;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(publishUrl);
        // You could add a toast notification here
    };

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
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                        <Share2 className="h-6 w-6" />
                    </div>

                    <h3 className="text-xl font-bold text-neutral-900">Publish Form</h3>
                    <p className="mt-2 text-sm text-neutral-500">
                        Ready to go live? Once published, <span className="font-semibold text-neutral-900">"{formTitle}"</span> will be accessible to anyone with the link.
                    </p>

                    <div className="mt-6 w-full rounded-xl border border-neutral-100 bg-neutral-50 p-3">
                        <p className="mb-2 text-left text-xs font-semibold uppercase tracking-wider text-neutral-400">
                            Public URL
                        </p>
                        <div className="flex items-center gap-2 overflow-hidden rounded-lg border border-neutral-200 bg-white p-2">
                            <span className="flex-1 truncate text-sm text-neutral-600 px-1">
                                {publishUrl}
                            </span>
                            <button
                                onClick={copyToClipboard}
                                className="rounded-md p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-brand-600 transition-colors"
                                title="Copy link"
                            >
                                <Copy className="h-4 w-4" />
                            </button>
                            <a
                                href={publishUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-md p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-brand-600 transition-colors"
                                title="Open link"
                            >
                                <ExternalLink className="h-4 w-4" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:justify-center">
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors sm:flex-none sm:px-6"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition-all active:scale-[0.98] sm:flex-none sm:px-6"
                    >
                        Publish Now
                    </button>
                </div>
            </div>
        </div>
    );
};
