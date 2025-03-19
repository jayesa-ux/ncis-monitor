import { FC, useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { Box } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { SnackbarProvider } from './Context/SnackbarContext';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
        background: {
            default: '#f5f5f5',
        },
        success: {
            main: '#4caf50',
        },
        info: {
            main: '#2196f3',
        },
        warning: {
            main: '#ff9800',
        },
        error: {
            main: '#f44336',
        },
    },
    components: {
        MuiContainer: {
            styleOverrides: {
                root: {
                    maxWidth: '100% !important',
                    paddingLeft: '1rem',
                    paddingRight: '1rem',
                },
            },
        },
    },
});

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
    const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

const App: FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(sessionStorage.getItem('isAuthenticated') === 'true');

    useEffect(() => {
        const checkAuth = () => {
            setIsAuthenticated(sessionStorage.getItem('isAuthenticated') === 'true');
        };

        window.addEventListener('storage', checkAuth);
        return () => {
            window.removeEventListener('storage', checkAuth);
        };
    }, []);

    return (
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <SnackbarProvider>
                    <CssBaseline />
                    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
                        {isAuthenticated}
                        <Box
                            component="main"
                            sx={{
                                flexGrow: 1,
                                width: '100%',
                                marginTop: isAuthenticated ? 4 : 0,
                                paddingLeft: isAuthenticated ? { xs: 1, sm: 2 } : 0,
                                paddingRight: isAuthenticated ? { xs: 1, sm: 2 } : 0,
                            }}
                        >
                            <Routes>
                                <Route path="/login" element={<Login />} />
                                <Route
                                    path="/"
                                    element={
                                        <ProtectedRoute>
                                            <Navbar />
                                            <Home />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/home"
                                    element={
                                        <ProtectedRoute>
                                            <Navbar />
                                            <Home />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/dashboard/:systemId/:playbookId"
                                    element={
                                        <ProtectedRoute>
                                            <Navbar />
                                            <Dashboard />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route path="*" element={<Navigate to="/login" replace />} />
                            </Routes>
                        </Box>
                        {isAuthenticated && <Footer />}
                    </Box>
                </SnackbarProvider>
            </ThemeProvider>
        </Provider>
    );
};

export default App;
