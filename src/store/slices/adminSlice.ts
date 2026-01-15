import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface AdminUser {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    is_verified: boolean;
    created_at: string;
    updated_at: string;
}

export interface AdminForm {
    id: string;
    owner_id: string;
    title: string;
    description: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface UserWithForms extends AdminUser {
    forms: AdminForm[];
}

interface AdminState {
    users: AdminUser[];
    forms: AdminForm[];
    usersWithForms: UserWithForms[];
    publishedCount: number;
    loading: boolean;
    error: string | null;
}

const initialState: AdminState = {
    users: [],
    forms: [],
    usersWithForms: [],
    publishedCount: 0,
    loading: false,
    error: null,
};

export const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        setUsers: (state, action: PayloadAction<AdminUser[]>) => {
            state.users = action.payload;
        },
        setForms: (state, action: PayloadAction<AdminForm[]>) => {
            state.forms = action.payload;
        },
        setUsersWithForms: (state, action: PayloadAction<UserWithForms[]>) => {
            state.usersWithForms = action.payload;
        },
        setPublishedCount: (state, action: PayloadAction<number>) => {
            state.publishedCount = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        removeUser: (state, action: PayloadAction<string>) => {
            state.users = state.users.filter(u => u.id !== action.payload);
            state.usersWithForms = state.usersWithForms.filter(u => u.id !== action.payload);
        },
        removeForm: (state, action: PayloadAction<string>) => {
            state.forms = state.forms.filter(f => f.id !== action.payload);
            // Also remove from usersWithForms if necessary, but that structure is complex to update deeply here
            // For now, we assume a refresh or separate list management
        }
    },
});

export const {
    setUsers,
    setForms,
    setUsersWithForms,
    setPublishedCount,
    setLoading,
    setError,
    removeUser,
    removeForm,
} = adminSlice.actions;

export default adminSlice.reducer;
