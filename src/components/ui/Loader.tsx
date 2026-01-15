import React from 'react';

interface LoaderProps {
    variant?: 'full' | 'overlay' | 'inline';
    text?: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    isLoading?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({
    variant = 'overlay',
    text = 'Loading...',
    size = 'md',
    className = '',
    isLoading = true,
}) => {
    if (!isLoading) return null;

    const sizeConfig = {
        sm: {
            spinner: 'h-4 w-4 border-2',
            text: 'text-xs',
            gap: 'gap-2',
        },
        md: {
            spinner: 'h-8 w-8 border-[3px]',
            text: 'text-sm',
            gap: 'gap-3',
        },
        lg: {
            spinner: 'h-12 w-12 border-4',
            text: 'text-base',
            gap: 'gap-4',
        },
    };

    const config = sizeConfig[size];

    const spinner = (
        <div className="relative" role="status" aria-label="Loading">
            <div
                className={`${config.spinner} rounded-full border-gray-200`}
                aria-hidden="true"
            />
            <div
                className={`absolute inset-0 ${config.spinner} rounded-full border-blue-600 border-t-transparent animate-spin`}
                aria-hidden="true"
            />
        </div>
    );

    const loaderContent = (
        <div className={`flex flex-col items-center justify-center ${config.gap}`}>
            {spinner}
            {text && (
                <p className={`font-medium text-gray-700 ${config.text}`}>
                    {text}
                </p>
            )}
        </div>
    );

    const variantStyles = {
        full: 'fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm',
        overlay: 'absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-lg',
        inline: '',
    };

    if (variant === 'inline') {
        return <div className={className}>{loaderContent}</div>;
    }

    return (
        <div className={`${variantStyles[variant]} ${className}`}>
            {loaderContent}
        </div>
    );
};
