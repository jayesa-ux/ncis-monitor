import { FC, useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, Container, Typography, Grid, Paper, Breadcrumbs, Link, IconButton, Button, CircularProgress } from '@mui/material';
import { ArrowBack as ArrowBackIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { selectSystemById } from '../redux/systemsSlice';
import { RootState } from '../redux/store';
import Console from '../components/Console';
import PlaybookInfo from '../components/PlaybookInfo';
import PlaybookSteps from '../components/PlaybookSteps';
import { Playbook } from '../types';
import { playbookService } from '../services/PlaybookService';

const Dashboard: FC = () => {
    const { systemId, playbookId } = useParams<{ systemId: string; playbookId: string }>();
    const navigate = useNavigate();

    const sysId: string = systemId!;
    const pbId: string = playbookId!;

    const system = useSelector((state: RootState) => selectSystemById(state, sysId));

    const [playbook, setPlaybook] = useState<Playbook | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [updateTrigger, setUpdateTrigger] = useState<number>(0);
    const [executionSpinnerVisible, setExecutionSpinnerVisible] = useState<boolean>(false);
    const [flowSpinnerVisible, setFlowSpinnerVisible] = useState<boolean>(false);

    const refreshPlaybook = useCallback(async () => {
        if (refreshing || !pbId) return;

        setRefreshing(true);
        try {
            const playbooks = await playbookService.getPlaybooks();
            const selectedPlaybook = playbooks.find((pb) => pb._id === pbId);
            setPlaybook(selectedPlaybook || null);
        } catch (error) {
            console.error('Error refreshing playbook:', error);
        } finally {
            setRefreshing(false);
        }
    }, [pbId, refreshing]);

    const triggerUpdate = useCallback(() => {
        setUpdateTrigger((prev) => prev + 1);
    }, []);

    const refreshAllData = useCallback(async () => {
        setExecutionSpinnerVisible(true);
        setFlowSpinnerVisible(true);

        await refreshPlaybook();
        triggerUpdate();

        setTimeout(() => {
            setExecutionSpinnerVisible(false);
            setFlowSpinnerVisible(false);
        }, 3000);
    }, [refreshPlaybook, triggerUpdate]);

    useEffect(() => {
        const fetchPlaybook = async () => {
            if (pbId) {
                setLoading(true);
                try {
                    const playbooks = await playbookService.getPlaybooks();
                    const selectedPlaybook = playbooks.find((pb) => pb._id === pbId);
                    setPlaybook(selectedPlaybook || null);
                } catch (error) {
                    console.error('Error fetching playbook:', error);
                    setPlaybook(null);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchPlaybook();
    }, [pbId]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (!loading && !refreshing) {
                refreshAllData();
            }
        }, 10000);

        return () => {
            clearInterval(intervalId);
        };
    }, [refreshAllData, loading, refreshing]);

    return (
        <Container maxWidth="xl">
            <Box mb={3} display="flex" alignItems="center">
                <IconButton onClick={() => navigate('/')} sx={{ mr: 1 }}>
                    <ArrowBackIcon />
                </IconButton>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link color="inherit" onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>
                        Inicio
                    </Link>
                    <Typography color="textPrimary">{system?.name}</Typography>
                </Breadcrumbs>
            </Box>

            <Box display="flex" alignItems="center" justifyContent="space-between" marginBottom={2}>
                <Typography variant="h4" component="h1">
                    Dashboard: {system?.name} {playbook && `/ ${playbook.name}`}
                </Typography>

                <Box display="flex" alignItems="center">
                    <Button
                        variant="outlined"
                        startIcon={refreshing ? <CircularProgress size={20} /> : <RefreshIcon />}
                        onClick={refreshAllData}
                        disabled={refreshing}
                    >
                        {refreshing ? 'Actualizando...' : 'Actualizar'}
                    </Button>
                </Box>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper
                        sx={{
                            height: 'auto',
                            mb: 3,
                            border: '1px solid #e0e0e0',
                            borderRadius: 1,
                            overflow: 'hidden',
                            minHeight: '350px',
                        }}
                        elevation={2}
                    >
                        <Box
                            sx={{
                                backgroundColor: '#2c3e50',
                                p: 2,
                                color: 'white',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <Typography variant="h6" fontWeight="bold">
                                Información del Playbook
                            </Typography>
                            {refreshing && <CircularProgress size={20} sx={{ color: 'white' }} />}
                        </Box>
                        {playbook && <PlaybookInfo playbook={playbook} />}
                    </Paper>

                    <Paper
                        sx={{
                            height: 'auto',
                            minHeight: '300px',
                            border: '1px solid #e0e0e0',
                            borderRadius: 1,
                            overflow: 'hidden',
                        }}
                        elevation={2}
                    >
                        <Box
                            sx={{
                                backgroundColor: '#2c3e50',
                                p: 2,
                                color: 'white',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <Typography variant="h6" fontWeight="bold">
                                Ejecución del Playbook
                            </Typography>
                            {executionSpinnerVisible && <CircularProgress size={20} sx={{ color: 'white' }} />}
                        </Box>
                        <Box sx={{ p: 2 }}>{playbook && <Console playbookId={playbook._id} updateTrigger={updateTrigger} />}</Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper
                        sx={{
                            height: 'auto',
                            minHeight: '700px',
                            border: '1px solid #e0e0e0',
                            borderRadius: 1,
                            overflow: 'hidden',
                        }}
                        elevation={2}
                    >
                        <Box
                            sx={{
                                backgroundColor: '#2c3e50',
                                p: 2,
                                color: 'white',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <Typography variant="h6" fontWeight="bold">
                                Flujo de Ejecución
                            </Typography>
                            {flowSpinnerVisible && <CircularProgress size={20} sx={{ color: 'white' }} />}
                        </Box>
                        {playbook && <PlaybookSteps playbookId={playbook._id} updateTrigger={updateTrigger} />}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard;
