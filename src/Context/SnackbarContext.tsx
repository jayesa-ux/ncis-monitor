import { createContext, useContext, useState, ReactNode } from 'react';
import { Snackbar, Alert } from '@mui/material';

interface SnackbarContextProps {
    showSnackbar: (message: string, severity?: 'success' | 'info' | 'warning' | 'error') => void;
}

const SnackbarContext = createContext<SnackbarContextProps | undefined>(undefined);

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState<'success' | 'info' | 'warning' | 'error'>('info');

    const showSnackbar = (msg: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
        setMessage(msg);
        setSeverity(type);
        setOpen(true);
    };

    return (
        <SnackbarContext.Provider value={{ showSnackbar }}>
            {children}
            <Snackbar open={open} onClose={() => setOpen(false)} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} sx={{ mt: 6 }}>
                <Alert
                    severity={severity}
                    onClose={() => setOpen(false)}
                    sx={{
                        color: '#fff',
                        bgcolor:
                            severity === 'success' ? '#2e7d32' : severity === 'info' ? '#1565c0' : severity === 'warning' ? '#ff8f00' : '#b71c1c',
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        padding: '12px 24px',
                        boxShadow: 3,
                    }}
                >
                    {message}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    );
};

export const useSnackbar = () => {
    const context = useContext(SnackbarContext);
    if (!context) {
        throw new Error('useSnackbar debe usarse dentro de un SnackbarProvider');
    }
    return context;
};
