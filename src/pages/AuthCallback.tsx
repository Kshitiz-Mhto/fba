import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const AuthCallback: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleCallback = async () => {
            const hash = window.location.hash;
            if (!hash) {
                navigate('/login');
                return;
            }

            const params = new URLSearchParams(hash.substring(1));
            const accessToken = params.get('access_token');
            const refreshToken = params.get('refresh_token');

            if (accessToken) {
                localStorage.setItem('token', accessToken);
                if (refreshToken) localStorage.setItem('refresh_token', refreshToken);

                try {
                    const response = await authAPI.syncGoogleUser();

                    localStorage.setItem('user', JSON.stringify(response.user));

                    if (response.user.role === 'admin') {
                        navigate('/admin');
                    } else {
                        navigate('/dashboard');
                    }
                } catch (error) {
                    console.error('Error syncing Google user:', error);
                    localStorage.removeItem('token');
                    localStorage.removeItem('refresh_token');
                    navigate('/login?error=sync_failed');
                }
            } else {
                navigate('/login');
            }
        };

        handleCallback();
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto"></div>
                <h2 className="mt-4 text-xl font-semibold text-neutral-900">Completing sign in...</h2>
                <p className="mt-2 text-neutral-500">Please wait while we set up your account.</p>
            </div>
        </div>
    );
};

export default AuthCallback;
