import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, Typography, Paper, Stack, Button, List, ListItem, Divider, Container } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { PlayArrow as PlayIcon } from '@mui/icons-material';
import { System, Playbook } from '../types';
import { selectAllSystems } from '../redux/systemsSlice';
import { playbookService } from '../services/PlaybookService';

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
};

const getPlaybookTypeColor = (type: string) => {
    switch (type) {
        case 'Detección':
            return '#3f51b5'; // Blue
        case 'Mitigación':
            return '#ff9800'; // Orange
        case 'Remediación':
            return '#f44336'; // Red
        case 'Validación':
            return '#4caf50'; // Green
        case 'Despliegue':
            return '#9c27b0'; // Purple
        case 'prevention':
            return '#757575'; // Purple
        default:
            return '#757575'; // Gray
    }
};

const Home: FC = () => {
    const systems = useSelector(selectAllSystems);
    const navigate = useNavigate();
    const [systemsWithPlaybooks, setSystemsWithPlaybooks] = useState<System[]>([]);

    useEffect(() => {
        const fetchPlaybooks = async () => {
            try {
                const allPlaybooks = await playbookService.getPlaybooks();

                const updatedSystems = systems.map((system) => ({
                    ...system,
                    playbooks: allPlaybooks,
                }));

                setSystemsWithPlaybooks(updatedSystems);
            } catch (error) {
                console.error('Error al cargar playbooks:', error);
                setSystemsWithPlaybooks(systems);
            }
        };

        fetchPlaybooks();
    }, [systems]);

    const handlePlaybookClick = (systemId: string, playbookId: string) => {
        navigate(`/dashboard/${systemId}/${playbookId}`);
    };

    return (
        <Container maxWidth="xl" sx={{ py: 2, mt: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
                Systems and Playbooks
            </Typography>

            <Grid container justifyContent="center">
                <Grid
                    component="div"
                    sx={{
                        xs: 12,
                        sm: 6,
                        md: 4,
                        lg: 3,
                        xl: 2,
                    }}
                >
                    <Stack spacing={3} sx={{ width: '100%', minWidth: '1000px' }}>
                        {systemsWithPlaybooks.map((system: System) => (
                            <Paper
                                key={system.id}
                                elevation={1}
                                sx={{
                                    width: '100%',
                                    borderRadius: 1,
                                    overflow: 'hidden',
                                }}
                            >
                                <Box
                                    sx={{
                                        p: 2,
                                        backgroundColor: '#2c3e50',
                                        borderBottom: '1px solid #e0e0e0',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
                                            {system.name}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#ecf0f1' }}>
                                            {system.description}
                                        </Typography>
                                    </Box>
                                </Box>

                                <List sx={{ width: '100%', p: 0 }}>
                                    {system.playbooks.map((playbook: Playbook, index) => (
                                        <Box key={playbook._id}>
                                            {index > 0 && <Divider />}
                                            <ListItem sx={{ p: 0 }}>
                                                <Box
                                                    sx={{
                                                        width: '100%',
                                                        p: 2,
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <Box>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                                            <Typography variant="subtitle1" fontWeight="bold">
                                                                {playbook.name}
                                                            </Typography>
                                                            <Box
                                                                sx={{
                                                                    ml: 2,
                                                                    backgroundColor: getPlaybookTypeColor(playbook.playbook_type),
                                                                    color: 'white',
                                                                    px: 1,
                                                                    py: 0.5,
                                                                    borderRadius: 1,
                                                                    fontSize: '0.75rem',
                                                                    fontWeight: 'bold',
                                                                }}
                                                            >
                                                                {playbook.playbook_type ?? '-'}
                                                            </Box>
                                                        </Box>
                                                        <Typography variant="body2" color="text.secondary">
                                                            <strong>{playbook.description}</strong>
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                                                            <strong>Created by:</strong> {playbook.created_by ?? '-'}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                                                            <strong>Created:</strong> {formatDate(playbook.created)}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                                                            <strong>Started:</strong> {formatDate(playbook.started)}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                                                            <strong>Status: </strong>
                                                            {playbook.state === 'RUNNING' ? (
                                                                <Typography component="span" sx={{ color: 'success.main', fontWeight: 'bold' }}>
                                                                    RUNNING
                                                                </Typography>
                                                            ) : playbook.state === 'END' ? (
                                                                <Typography component="span" sx={{ color: 'error.main', fontWeight: 'bold' }}>
                                                                    END
                                                                </Typography>
                                                            ) : (
                                                                playbook.state
                                                            )}
                                                        </Typography>
                                                    </Box>

                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        size="small"
                                                        startIcon={<PlayIcon />}
                                                        onClick={() => handlePlaybookClick(system.id, playbook._id)}
                                                        sx={{
                                                            minWidth: '120px',
                                                            '&:hover': {
                                                                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                                                                transform: 'translateY(-2px)',
                                                                transition: 'all 0.3s',
                                                            },
                                                        }}
                                                    >
                                                        Dashboard
                                                    </Button>
                                                </Box>
                                            </ListItem>
                                        </Box>
                                    ))}
                                </List>
                            </Paper>
                        ))}
                    </Stack>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Home;
