import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type FormStatus = 'published' | 'draft' | 'closed';

export interface Form {
    id: string;
    owner_id: string;
    title: string;
    description: string | null;
    status: FormStatus;
    is_public: boolean;
    allow_multiple_submissions: boolean;
    close_date: string | null;
    thank_you_message: string | null;
    redirect_url: string | null;
    responses?: number; // Calculated or returned separately
    created_at: string;
    updated_at: string;
}

interface DashboardState {
    forms: Form[];
    searchQuery: string;
    statusFilter: string;
    loading: boolean;
}

const initialState: DashboardState = {
    forms: [],
    searchQuery: '',
    statusFilter: 'all',
    loading: false,
};

export const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload;
        },
        setStatusFilter: (state, action: PayloadAction<string>) => {
            state.statusFilter = action.payload;
        },
        setDashboardData: (state, action: PayloadAction<{ forms: Form[] | null, stats: any }>) => {
            state.forms = action.payload.forms || [];
            state.loading = false;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        deleteForm: (state, action: PayloadAction<string>) => {
            state.forms = state.forms.filter((f) => f.id !== action.payload);
        },
        duplicateForm: (state, action: PayloadAction<Form>) => {
            state.forms.unshift(action.payload);
        },
        updateFormStatus: (state, action: PayloadAction<{ id: string; status: FormStatus; is_public: boolean }>) => {
            const form = state.forms.find((f) => f.id === action.payload.id);
            if (form) {
                form.status = action.payload.status;
                form.is_public = action.payload.is_public;
            }
        },
    },
});

export const {
    setSearchQuery,
    setStatusFilter,
    setDashboardData,
    setLoading,
    deleteForm,
    duplicateForm,
    updateFormStatus,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
