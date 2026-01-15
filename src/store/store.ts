import { configureStore } from '@reduxjs/toolkit';
import formReducer from './slices/formSlice';
import dashboardReducer from './slices/dashboardSlice';
import adminReducer from './slices/adminSlice';

export const store = configureStore({
    reducer: {
        form: formReducer,
        dashboard: dashboardReducer,
        admin: adminReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
