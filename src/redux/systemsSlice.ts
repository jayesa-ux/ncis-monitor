import { createSlice } from '@reduxjs/toolkit';
import { SystemsState, System } from '../types';
import { RootState } from './store';

const mockSystems: System[] = [
    {
        id: '1',
        name: 'System 1',
        description: 'System 1 - playbooks 1',
        playbooks: [],
    },
    {
        id: '2',
        name: 'System 2',
        description: 'System 2 - playbooks 2',
        playbooks: [],
    },
    {
        id: '3',
        name: 'System 3',
        description: 'System 3 - playbooks 3',
        playbooks: [],
    },
];

const initialState: SystemsState = {
    systems: mockSystems,
    loading: false,
    error: null,
};

export const systemsSlice = createSlice({
    name: 'systems',
    initialState,
    reducers: {},
});

export const selectAllSystems = (state: RootState) => state.systems.systems;
export const selectSystemById = (state: RootState, systemId: string) => state.systems.systems.find((system) => system.id === systemId);
export default systemsSlice.reducer;
