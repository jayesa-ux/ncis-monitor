import { FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';


const Footer: FC = () => {
    return (
        <Box component="footer" sx={{ py: 2, textAlign: 'center', mt: 'auto', backgroundColor: '#f5f5f5' }}>
            <Typography variant="body2" color="textSecondary">
                © {new Date().getFullYear()} NCIS Monitor
            </Typography>
        </Box>
    );
};

export default Footer;
