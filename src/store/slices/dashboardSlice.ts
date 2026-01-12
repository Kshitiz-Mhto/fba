import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type FormStatus = 'published' | 'draft' | 'closed';

export interface Form {
    id: string;
    title: string;
    status: FormStatus;
    responses: number;
    lastUpdated: string;
}

interface DashboardState {
    forms: Form[];
    searchQuery: string;
    statusFilter: string;
}

const MOCK_FORMS: Form[] = [
    {
        id: '1',
        title: 'Product Feedback Survey',
        status: 'published',
        responses: 128,
        lastUpdated: '2 hours ago',
    },
    {
        id: '4',
        title: 'Website Redesign Feedback',
        status: 'closed',
        responses: 892,
        lastUpdated: '1 week ago',
    },
    {
        id: '5',
        title: 'Event Registration Form',
        status: 'draft',
        responses: 0,
        lastUpdated: '2 weeks ago',
    },
];

const initialState: DashboardState = {
    forms: MOCK_FORMS,
    searchQuery: '',
    statusFilter: 'all',
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
        deleteForm: (state, action: PayloadAction<string>) => {
            state.forms = state.forms.filter((f) => f.id !== action.payload);
        },
        duplicateForm: (state, action: PayloadAction<string>) => {
            const formToDuplicate = state.forms.find((f) => f.id === action.payload);
            if (formToDuplicate) {
                const newForm: Form = {
                    ...formToDuplicate,
                    id: crypto.randomUUID(),
                    title: `${formToDuplicate.title} (Copy)`,
                    responses: 0,
                    lastUpdated: 'Just now',
                    status: 'draft',
                };
                state.forms.unshift(newForm);
            }
        },
    },
});

export const {
    setSearchQuery,
    setStatusFilter,
    deleteForm,
    duplicateForm,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
