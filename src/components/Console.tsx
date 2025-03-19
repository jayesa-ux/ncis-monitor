import { FC, useEffect, useState, useRef } from 'react';
import { Box, Typography, CircularProgress, Divider } from '@mui/material';
import { playbookService } from '../services/PlaybookService';

interface ConsoleProps {
    playbookId: string;
    updateTrigger: number;
}

interface LogEntry {
    text: string;
    timestamp: string;
}

const Console: FC<ConsoleProps> = ({ playbookId, updateTrigger }) => {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const consoleRef = useRef<HTMLDivElement>(null);

    const fetchLogs = async () => {
        if (refreshing || !playbookId) return;

        setRefreshing(true);
        try {
            const playbookLogs = await playbookService.getPlaybookLogs(playbookId);
            const formattedLogs = playbookLogs.map((log) => {
                if (typeof log === 'object' && log !== null) {
                    if ('text' in log && 'timestamp' in log) {
                        return log as LogEntry;
                    }
                    if ('message' in log) {
                        return {
                            text: log.message || JSON.stringify(log),
                            timestamp: new Date().toUTCString(),
                        };
                    }
                }
                return {
                    text: typeof log === 'string' ? log : JSON.stringify(log),
                    timestamp: new Date().toUTCString(),
                };
            });
            setLogs(formattedLogs);
        } catch (error) {
            console.error('Error fetching playbook logs:', error);
            setLogs([{ text: 'Error fetching logs', timestamp: new Date().toUTCString() }]);
        } finally {
            setRefreshing(false);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (playbookId) {
            fetchLogs();
        }
    }, [playbookId]);

    useEffect(() => {
        if (updateTrigger > 0 && playbookId) {
            fetchLogs();
        }
    }, [updateTrigger, playbookId]);

    useEffect(() => {
        if (consoleRef.current) {
            consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
        }
    }, [logs]);

    const formatTimestamp = (timestamp: string) => {
        try {
            const date = new Date(timestamp);
            return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        } catch (error) {
            return timestamp;
        }
    };

    const getLogStyle = (index: number) => {
        if (index === logs.length - 1 && logs.length > 0 && refreshing) {
            return {
                animation: 'fadeIn 0.5s ease-in-out',
                background: 'rgba(0, 255, 0, 0.1)',
            };
        }
        return {};
    };

    return (
        <Box
            ref={consoleRef}
            sx={{
                width: '100%',
                height: '250px',
                minHeight: '343px',
                backgroundColor: '#1e1e1e',
                color: '#00ff00',
                p: 2,
                borderRadius: 1,
                fontFamily: 'monospace',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                '& .log-message': {
                    transition: 'background-color 0.3s ease',
                },
                '& .log-entry': {
                    padding: '4px 0',
                },
                '& .timestamp': {
                    color: '#888',
                    fontSize: '0.75rem',
                    marginBottom: '2px',
                },
                '& .log-text': {
                    wordBreak: 'break-word',
                },
                '@keyframes fadeIn': {
                    '0%': { opacity: 0.5 },
                    '100%': { opacity: 1 },
                },
            }}
        >
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <CircularProgress size={24} sx={{ color: '#00ff00' }} />
                </Box>
            ) : (
                <>
                    {logs.map((log, index) => (
                        <Box
                            key={`${index}-${log.text.substring(0, 10)}-${log.timestamp}`}
                            className="log-entry"
                            sx={{
                                mb: 1,
                                ...getLogStyle(index),
                            }}
                        >
                            <Typography variant="caption" className="timestamp" display="block">
                                {formatTimestamp(log.timestamp)}
                            </Typography>
                            <Typography
                                variant="body2"
                                className="log-text"
                                sx={{
                                    opacity: 1,
                                }}
                            >
                                {`${log.text}`}
                            </Typography>
                            {index < logs.length - 1 && <Divider sx={{ mt: 1, opacity: 0.2, borderColor: '#444' }} />}
                        </Box>
                    ))}
                    {refreshing && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}>
                            <CircularProgress size={16} sx={{ color: '#00ff00' }} />
                        </Box>
                    )}
                </>
            )}
        </Box>
    );
};

export default Console;
