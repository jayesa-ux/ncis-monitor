import { configureStore } from '@reduxjs/toolkit';
import systemsReducer from './systemsSlice';

export const store = configureStore({
    reducer: {
        systems: systemsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
