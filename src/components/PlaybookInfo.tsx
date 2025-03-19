import { FC } from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { Playbook } from '../types';

interface PlaybookInfoProps {
    playbook: Playbook;
}

const PlaybookInfo: FC<PlaybookInfoProps> = ({ playbook }) => {
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

    return (
        <Box sx={{ p: 2 }} alignContent={'start'} alignItems={'start'}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                {playbook.name}
            </Typography>

            <Typography variant="body1" paragraph>
                {playbook.description}
            </Typography>

            <Divider sx={{ my: 2 }} />

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
                <strong>Status:</strong>{' '}
                {playbook.state === 'RUNNING' ? (
                    <Typography component="span" sx={{ color: 'success.main', fontWeight: 'bold', fontSize: '1rem' }}>
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
    );
};

export default PlaybookInfo;
