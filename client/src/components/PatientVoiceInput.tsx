import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, IconButton, Typography, Button, CircularProgress } from '@mui/material';
import { Mic, MicNone } from '@mui/icons-material';

import { useAudioRecorder } from '../hooks/useAudioRecorder';

const AudioRecorder: React.FC = () => {
    const { recording, startRecording, stopRecording, audioBlob, sendAudioToBackend } = useAudioRecorder();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (audioBlob) {
            retrieveResults()
        }
    }, [audioBlob]);

    const retrieveResults = async () => {
        setIsProcessing(true);
        await sendAudioToBackend(audioBlob);
        setIsProcessing(false);
        navigate('/staff');
    };

    return (
        <Container sx={{mt: 5}}>
            <Typography variant="h3" gutterBottom>Instant Help via Voice</Typography>
            <Typography variant="body1" gutterBottom>Please record and describe what you need to get help immediately.</Typography>
                <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                    <IconButton
                        color="primary"
                        onClick={recording ? stopRecording : startRecording}
                        disabled={isProcessing}
                        style={{
                            backgroundColor: recording ? 'red' : '#3f51b5',
                            opacity: isProcessing ? 0.5 : 1,
                            color: 'white',
                            width: 80,
                            height: 80,
                        }}
                    >
                        {recording ? <MicNone /> : <Mic />}
                    </IconButton>
                    <Typography variant="body2">
                        {recording ? 'Recording...' : 'Press to Record'}
                    </Typography>
                </Box>

                {isProcessing && (
                    <Box display="flex" justifyContent="center" gap={1}>
                        <CircularProgress size={24} />
                        <Typography variant="body2" color="textSecondary">Processing...</Typography>
                    </Box>
                )}
        </Container>
    );
}


export default AudioRecorder;
