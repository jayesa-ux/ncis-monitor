import { Playbook, Step } from '../types';

const API_URL = '/api';

class PlaybookService {
    async getPlaybook(playbookId: string): Promise<Playbook | null> {
        try {
            const response = await fetch(`${API_URL}/playbook`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const playbooks = await response.json();
            const playbook = playbooks.find((pb: Playbook) => pb._id === playbookId);

            return playbook || null;
        } catch (error) {
            console.error('Error fetching playbook:', error);
            return null;
        }
    }

    async getPlaybookSteps(playbookId: string): Promise<Step[]> {
        try {
            const response = await fetch(`${API_URL}/playbooks/${playbookId}/steps`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const steps = await response.json();
            return steps;
        } catch (error) {
            console.error('Error fetching playbook steps:', error);
            return [];
        }
    }

    async getPlaybookLogs(playbookId: string): Promise<any[]> {
        try {
            const response = await fetch(`${API_URL}/playbooks/${playbookId}/logs`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const logs = await response.json();
            return logs;
        } catch (error) {
            console.error('Error fetching playbook logs:', error);
            return [];
        }
    }

    async getPlaybooks(): Promise<Playbook[]> {
        try {
            const response = await fetch(`${API_URL}/playbooks`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const playbooks = await response.json();
            return playbooks;
        } catch (error) {
            console.error('Error fetching all playbooks:', error);
            return [];
        }
    }
}

export const playbookService = new PlaybookService();
