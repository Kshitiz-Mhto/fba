import React from 'react';
import { LeftPanel } from './components/LeftPanel';
import { Canvas } from './components/Canvas';
import { RightPanel } from './components/RightPanel';
import { ArrowLeft, Eye, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BuilderLayout: React.FC = () => {
    return (
        <div className="flex h-screen flex-col bg-white font-sans selection:bg-brand-200 selection:text-brand-900">
            {/* Builder Header */}
            <header className="flex h-14 items-center justify-between border-b border-neutral-200 px-4">
                <div className="flex items-center gap-4">
                    <Link to="/dashboard" className="text-neutral-500 hover:text-neutral-900">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div className="h-6 w-px bg-neutral-200" />
                    <span className="text-sm font-medium text-neutral-900">Untitled Form</span>
                    <span className="rounded bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-500">
                        Draft
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100 transition-colors">
                        <Eye className="h-4 w-4" />
                        <span>Preview</span>
                    </button>
                    <button className="flex items-center gap-2 rounded-md bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700 transition-colors">
                        <Share2 className="h-4 w-4" />
                        <span>Publish</span>
                    </button>
                </div>
            </header>

            {/* Builder Workspace */}
            <div className="flex flex-1 overflow-hidden">
                <LeftPanel />
                <Canvas />
                <RightPanel />
            </div>
        </div>
    );
};
