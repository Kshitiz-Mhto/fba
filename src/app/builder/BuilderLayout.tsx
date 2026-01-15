import React from 'react';
import { LeftPanel } from './components/LeftPanel';
import { Canvas } from './components/Canvas';
import { RightPanel } from './components/RightPanel';
import { Eye, Share2, CloudCheck } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { setTitle, setForm, resetForm } from '../../store/slices/formSlice';
import { userAPI } from '../../services/api';
import { PublishConfirmModal } from '../dashboard/components/PublishConfirmModal';
import { Loader } from '../../components/ui/Loader';


export const BuilderLayout: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    React.useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            navigate('/login');
        }
    }, [navigate]);
    const { title, description, questions } = useSelector((state: RootState) => state.form);
    const [isSaving, setIsSaving] = React.useState(false);
    const [lastSaved, setLastSaved] = React.useState<Date | null>(null);
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [isPublishModalOpen, setIsPublishModalOpen] = React.useState(false);
    const [publishUrl, setPublishUrl] = React.useState('');

    // Fetch form data on mount
    React.useEffect(() => {
        const fetchForm = async () => {
            if (!id) return;

            // Reset form state before fetching new data
            setIsLoaded(false);
            dispatch(resetForm());

            try {
                const data = await userAPI.getForm(id);
                dispatch(setForm(data));
                setLastSaved(new Date());
                setIsLoaded(true);
            } catch (error) {
                console.error('Failed to fetch form:', error);
            }
        };
        fetchForm();
    }, [id, dispatch]);

    // Auto-save logic
    React.useEffect(() => {
        if (!isLoaded || !id) return;

        const timer = setTimeout(async () => {
            setIsSaving(true);
            try {
                const syncData = {
                    title,
                    description,
                    questions: questions.map((q, i) => ({
                        id: q.id,
                        type: q.type,
                        title: q.title,
                        description: q.description,
                        required: q.required,
                        emoji: q.emoji,
                        position: i,
                        options: q.options?.map((opt, j) => ({
                            label: opt,
                            position: j
                        }))
                    }))
                };
                await userAPI.updateForm(id, syncData);
                setLastSaved(new Date());
            } catch (error) {
                console.error('Failed to auto-save form:', error);
            } finally {
                setIsSaving(false);
            }
        }, 2000); // 2 second debounce

        return () => clearTimeout(timer);
    }, [id, title, description, questions]);

    const onPublishClick = () => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const firstName = (user.first_name || 'user').trim().replace(/\s+/g, '_');
        const formSlug = title.trim().replace(/\s+/g, '_');
        const url = `${window.location.origin}/${firstName}/${formSlug}`;
        setPublishUrl(url);
        setIsPublishModalOpen(true);
    };

    const handleConfirmPublish = async () => {
        if (!id) return;
        try {
            await userAPI.publishForm(id);
            setIsPublishModalOpen(false);
        } catch (error) {
            console.error('Failed to publish form:', error);
            alert('Failed to publish form.');
        }
    };

    if (!isLoaded) {
        return <Loader variant="full" text="Loading form builder..." />;
    }

    return (
        <div className="flex h-screen flex-col bg-white font-sans selection:bg-brand-200 selection:text-brand-900">
            <header className="flex h-14 items-center justify-between border-b border-neutral-200 px-4">
                <div className="flex items-center gap-3">
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
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-50 text-xs font-medium text-neutral-500 min-w-[120px] justify-center">
                        {isSaving ? (
                            <Loader variant="inline" size="sm" text="Saving..." />
                        ) : (
                            <>
                                <CloudCheck className="h-3.5 w-3.5 text-emerald-600" />
                                <span>{lastSaved ? `Saved at ${lastSaved.toLocaleTimeString()}` : 'Saved'}</span>
                            </>
                        )}
                    </div>
                    <Link
                        to="/preview"
                        className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100 transition-colors"
                    >
                        <Eye className="h-4 w-4" />
                        <span>Preview</span>
                    </Link>
                    <button
                        onClick={onPublishClick}
                        className="flex items-center gap-2 rounded-md bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
                    >
                        <Share2 className="h-4 w-4" />
                        <span>Publish</span>
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                <LeftPanel />
                <Canvas />
                <RightPanel />
            </div>

            <PublishConfirmModal
                isOpen={isPublishModalOpen}
                onClose={() => setIsPublishModalOpen(false)}
                onConfirm={handleConfirmPublish}
                formTitle={title}
                publishUrl={publishUrl}
            />
        </div>
    );
};
