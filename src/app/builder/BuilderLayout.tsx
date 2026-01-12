import React from 'react';
import { LeftPanel } from './components/LeftPanel';
import { Canvas } from './components/Canvas';
import { RightPanel } from './components/RightPanel';
import { ArrowLeft, Eye, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { setTitle } from '../../store/slices/formSlice';

export const BuilderLayout: React.FC = () => {
    const dispatch = useDispatch();
    const { title, description, questions } = useSelector((state: RootState) => state.form);

    const onPublish = () => {
        const username = 'user';
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const storageKey = `form_${username}_${slug}`;

        const formData = {
            title,
            description,
            questions
        };

        localStorage.setItem(storageKey, JSON.stringify(formData));

        const url = `/${username}/${slug}`;
        window.open(url, '_blank');
    };

    return (
        <div className="flex h-screen flex-col bg-white font-sans selection:bg-brand-200 selection:text-brand-900">
            {/* Builder Header */}
            <header className="flex h-14 items-center justify-between border-b border-neutral-200 px-4">
                <div className="flex items-center gap-4">
                    <Link to="/dashboard" className="text-neutral-500 hover:text-neutral-900">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div className="h-6 w-px bg-neutral-200" />
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => dispatch(setTitle(e.target.value))}
                        className="bg-transparent text-sm font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-500 rounded px-1 -ml-1 w-48"
                        placeholder="Untitled Form"
                    />
                    <span className="rounded bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-500">
                        Draft
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        to="/preview"
                        className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100 transition-colors"
                    >
                        <Eye className="h-4 w-4" />
                        <span>Preview</span>
                    </Link>
                    <button
                        onClick={onPublish}
                        className="flex items-center gap-2 rounded-md bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
                    >
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
