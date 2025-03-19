export type PlaybookStatus = 'RUNNING' | 'END';

export interface Playbook {
    _id: string;
    name: string;
    description: string;
    playbook_type: string;
    created_by: string;
    created: string;
    started: string;
    modify: string;
    state: PlaybookStatus;
}

export interface System {
    id: string;
    name: string;
    description: string;
    playbooks: Playbook[];
}

export interface Step {
    active: boolean;
    check: boolean;
    description: string;
    id: string;
    last_modified: string;
    name: string;
    pb_id: string;
    type: string;
}

export interface SystemsState {
    systems: System[];
    loading: boolean;
    error: string | null;
}

export type SystemSecurityStatus = 'normal' | 'alert' | 'critical';
