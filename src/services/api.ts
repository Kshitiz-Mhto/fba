import axios, { type InternalAxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        // Don't redirect if the error is from the login endpoint itself
        const isLoginRequest = error.config?.url?.includes('/auth/login');

        if (error.response?.status === 401 && !isLoginRequest) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export interface SignupRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    user: {
        id: string;
        email: string;
        first_name?: string;
        last_name?: string;
        role?: string;
    };
}

export interface GoogleAuthResponse {
    url: string;
}

export const authAPI = {
    signup: async (data: SignupRequest) => {
        const response = await api.post('/auth/signup', {
            email: data.email,
            password: data.password,
            first_name: data.firstName,
            last_name: data.lastName,
            role: data.role || 'user',
        });
        return response.data;
    },

    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/login', data);
        return response.data;
    },

    getGoogleAuthUrl: async (): Promise<GoogleAuthResponse> => {
        const response = await api.get<GoogleAuthResponse>('/auth/google');
        return response.data;
    },

    syncGoogleUser: async (): Promise<any> => {
        const response = await api.post('/auth/google/sync');
        return response.data;
    },

    refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/refresh', {
            refresh_token: refreshToken,
        });
        return response.data;
    },

    verifyEmail: async (token: string) => {
        const response = await api.post('/auth/user-verify', null, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },
};

export const userAPI = {
    getDashboardData: async () => {
        const response = await api.get('/user/dashboard');
        return response.data;
    },
    createForm: async (data: { title: string; description?: string }) => {
        const response = await api.post('/user/forms', data);
        return response.data;
    },
    deleteForm: async (id: string) => {
        const response = await api.delete(`/user/forms/${id}`);
        return response.data;
    },
    getForm: async (id: string) => {
        const response = await api.get(`/user/forms/${id}`);
        return response.data;
    },
    updateForm: async (id: string, data: any) => {
        const response = await api.put(`/user/forms/${id}`, data);
        return response.data;
    },
    duplicateForm: async (id: string) => {
        const response = await api.post(`/user/forms/${id}/duplicate`);
        return response.data;
    },
    publishForm: async (id: string) => {
        const response = await api.put(`/user/forms/${id}/publish`);
        return response.data;
    },
    unpublishForm: async (id: string) => {
        const response = await api.put(`/user/forms/${id}/unpublish`);
        return response.data;
    },
    getPublicForm: async (username: string, slug: string) => {
        const response = await api.get(`/public/forms/${username}/${slug}`);
        return response.data;
    },
    submitForm: async (id: string, answers: any[]) => {
        const response = await api.post(`/public/forms/${id}/submit`, { answers });
        return response.data;
    },
    getFormSubmissions: async (id: string) => {
        const response = await api.get(`/user/forms/${id}/submissions`);
        return response.data;
    },
};

export const adminAPI = {
    getAllUsers: async () => {
        const response = await api.get('/admin/users');
        return response.data;
    },
    getAllForms: async () => {
        const response = await api.get('/admin/forms');
        return response.data;
    },
    getUsersWithForms: async () => {
        const response = await api.get('/admin/users-with-forms');
        return response.data;
    },
    deleteUser: async (id: string) => {
        const response = await api.delete(`/admin/users/${id}`);
        return response.data;
    },
    deleteForm: async (id: string) => {
        const response = await api.delete(`/admin/forms/${id}`);
        return response.data;
    },
    getPublishedFormsCount: async () => {
        const response = await api.get('/admin/published-count');
        return response.data;
    },
};

export default api;
