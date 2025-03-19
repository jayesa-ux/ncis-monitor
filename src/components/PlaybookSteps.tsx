import { FC, useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { playbookService } from '../services/PlaybookService';
import { Step } from '../types';
import moment from 'moment';

interface PlaybookStepsProps {
    playbookId: string;
    updateTrigger: number;
}

const PlaybookSteps: FC<PlaybookStepsProps> = ({ playbookId, updateTrigger }) => {
    const [steps, setSteps] = useState<Step[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [previousSteps, setPreviousSteps] = useState<Step[]>([]);

    const formatDate = (date: string) => {
        return moment(date).format('DD/MM/YYYY HH:MM');
    };

    const fetchSteps = async () => {
        if (refreshing || !playbookId) return;

        setRefreshing(true);
        try {
            const playbookSteps = await playbookService.getPlaybookSteps(playbookId);
            setPreviousSteps(steps);
            setSteps(playbookSteps);
        } catch (error) {
            console.error('Error fetching playbook steps:', error);
            setSteps([]);
        } finally {
            setRefreshing(false);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (playbookId) {
            fetchSteps();
        }
    }, [playbookId]);

    useEffect(() => {
        if (updateTrigger > 0 && playbookId) {
            fetchSteps();
        }
    }, [updateTrigger, playbookId]);

    const getStepIcon = (check: boolean, active: boolean) => {
        if (!active && check) return '✅';
        if (active && !check) return '▶';
        if (!active && !check) return '☐';
        return '☐';
    };

    const getStepColor = (check: boolean, active: boolean) => {
        if (!active && check) return '#4caf50';
        if (active && !check) return '#2196f3';
        if (!active && !check) return '#757575';
        return '#757575';
    };

    const getStepStatusText = (check: boolean, active: boolean) => {
        if (!active && check) return 'Completado';
        if (active && !check) return 'En ejecución';
        if (!active && !check) return 'No iniciado';
        return 'No iniciado';
    };

    const hasStepChanged = (step: Step) => {
        if (!previousSteps.length) return false;

        const prevStep = previousSteps.find((s) => s.id === step.id);
        if (!prevStep) return true;

        return prevStep.check !== step.check || prevStep.active !== step.active;
    };

    const getStepAnimation = (step: Step) => {
        if (hasStepChanged(step)) {
            return {
                animation: 'highlight 2s ease-in-out',
            };
        }
        return {};
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" p={4} height="100%">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                p: 2,
                height: '750px',
                overflow: 'auto',
                padding: 2,
                border: '1px solid',
                borderColor: 'grey.300',
                '@keyframes highlight': {
                    '0%': { backgroundColor: 'rgba(33, 150, 243, 0.3)' },
                    '100%': { backgroundColor: 'transparent' },
                },
            }}
        >
            {refreshing && (
                <Box display="flex" justifyContent="center" p={1} mb={2}>
                    <CircularProgress size={24} />
                </Box>
            )}

            {steps.length === 0 ? (
                <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ py: 4 }}>
                    No hay pasos disponibles para este playbook.
                </Typography>
            ) : (
                steps.map((step, index) => (
                    <Box
                        key={step.id}
                        sx={{
                            display: 'flex',
                            mb: 2,
                            p: 2,
                            borderLeft: `4px solid ${getStepColor(step.check, step.active)}`,
                            backgroundColor: step.active ? 'rgba(33, 150, 243, 0.08)' : 'transparent',
                            borderRadius: '4px',
                            transition: 'all 0.3s ease',
                            ...getStepAnimation(step),
                        }}
                    >
                        <Box sx={{ mr: 2, fontSize: '1.5rem' }}>{getStepIcon(step.check, step.active)}</Box>

                        <Box>
                            <Typography variant="subtitle1" fontWeight={step.active ? 'bold' : 'normal'}>
                                {index + 1}. {step.name}
                            </Typography>

                            <Typography variant="body2" color="text.secondary">
                                <strong>Description:</strong> {step.description ?? '-'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Type:</strong> {step.type}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Last modified:</strong> {formatDate(step.last_modified)}
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{
                                    color: getStepColor(step.check, step.active),
                                    mt: 0.5,
                                    display: 'block',
                                    fontWeight: 'bold',
                                    fontSize: '1rem',
                                }}
                            >
                                {getStepStatusText(step.check, step.active)}
                            </Typography>
                        </Box>
                    </Box>
                ))
            )}
        </Box>
    );
};

export default PlaybookSteps;
