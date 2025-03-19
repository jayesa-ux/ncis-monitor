import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Badge from '@mui/material/Badge';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Box } from '@mui/material';
import { authService } from '../services/AuthService';

const Navbar: FC = () => {
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const username = authService.getCurrentUser() || 'Usuario';

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleNotificationsOpen = (event: React.MouseEvent<HTMLElement>) => {
        // setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleNavigateToHome = () => {
        navigate('/home');
        handleMenuClose();
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <AppBar position="fixed">
            <Toolbar>
                <Box sx={{ display: 'flex', flexGrow: 1, alignItems: 'center' }} onClick={handleNavigateToHome}>
                    <img src="/logo.svg" alt="NCIS Monitor" style={{ height: 50, marginRight: 15 }} />
                    <Typography variant="h6" sx={{ cursor: 'pointer' }}>
                        NCIS MONITOR
                    </Typography>
                </Box>

                <IconButton color="inherit" onClick={handleMenuOpen}>
                    <AccountCircleIcon sx={{ marginRight: 1, color: 'white' }} />
                    <Typography variant="body1" sx={{ color: 'white' }}>
                        Admin
                    </Typography>
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                >
                    <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
