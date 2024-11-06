import React, { useState, useRef } from 'react';
import { Button, Typography, Container, Box, Paper, Divider, List, ListItem, ListItemText, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';



interface BackendResult {
    transcription: string;
    care_instructions: {
        summary: string;
        actions: string[];
    };
}

const AudioRecorder: React.FC = () => {
    const [recording, setRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [result, setResult] = useState<BackendResult>();

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);

        mediaRecorderRef.current.ondataavailable = (event) => {
            setAudioBlob(event.data);
            sendAudioToBackend(event.data);
        };

        mediaRecorderRef.current.start();
        setRecording(true);
    };

    const stopRecording = () => {
        console.log('state now', mediaRecorderRef.current?.state)
        mediaRecorderRef.current?.stop();
        console.log(mediaRecorderRef.current?.state)
        setRecording(false);
    };

    const sendAudioToBackend = async (blob: Blob | null) => {
        if (blob) {
            const formData = new FormData();
            formData.append('audio', blob, 'audio.wav');

            try {
                const response = await fetch('http://localhost:5000/api/voice', {
                    method: 'POST',
                    body: formData,
                });

                const result = await response.json();
                setResult(result);
                console.log(result); // Handle the response from the backend
            } catch (error) {
                console.log(error) 
            }
        }
    };

    return (
        <Container>
            <Typography variant="h2" gutterBottom>
                Audio Recorder
            </Typography>
            <Typography variant="h6" gutterBottom>
                Please record and say what you need to get help immediately.
            </Typography>
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center',  gap: 1 }}>
                <Button
                    variant="contained"
                    color={recording ? "warning" : "primary"}
                    onClick={recording ? stopRecording : startRecording}>
                    {recording ? 'Stop Recording' : 'Start Recording'}
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => sendAudioToBackend(audioBlob)}
                    disabled={!audioBlob}>Retry</Button>
            </Box>

            <NurseDashboard result={result} />
        </Container>
    );
};


// Helper function to parse text and make words between * bold
const parseAndRenderText = (text: string) => {
    const parts = text.split(/(\*[^*]+\*)/); // Split by words wrapped in *
    return parts.map((part, index) =>
        part.startsWith("*") && part.endsWith("*") ? (
            <Typography component="span" style={{ fontWeight: 'bold' }} key={index}>
                {part.replace(/\*/g, '')}
            </Typography>
        ) : (
            <Typography component="span" key={index}>
                {part}
            </Typography>
        )
    );
};

const NurseDashboard: React.FC<{ result: any }> = ({ result }) => {
    return (
        <Container maxWidth="sm">
            <Typography variant="h2" gutterBottom>Nurse Dashboard</Typography>
            {result?.care_instructions && (
                <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
                    <Typography variant="h5" color="primary" gutterBottom>
                        Patient Summary
                    </Typography>
                    <Typography variant="body1" style={{ fontStyle: 'italic', marginBottom: '20px' }}>
                        {parseAndRenderText(result.care_instructions.summary)}
                    </Typography>
                    
                    <Divider style={{ margin: '20px 0' }} />


                    <Accordion defaultExpanded={false}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="actions-content"
                            id="actions-header">
                            <Typography variant="h6" color="primary" gutterBottom>
                                Recommended Actions
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <List>
                                {result.care_instructions.actions.map((action: string, index: number) => (
                                    <ListItem key={index} style={{ paddingLeft: 0 }}>
                                        <ListItemText
                                            primary={<Typography variant="body1">{index + 1}. {parseAndRenderText(action)}</Typography>}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion defaultExpanded={false}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="transciption-content"
                            id="transciption-header">
                            <Typography variant="h6" color="primary" gutterBottom>
                                Patient's original input
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>

                            <Paper elevation={1} style={{ padding: '15px', marginTop: '20px', fontStyle: 'italic', borderLeft: '5px solid #3f51b5' }}>
                                <Typography variant="body1">
                                    {result.transcription}
                                </Typography>
                            </Paper>
                        </AccordionDetails>
                    </Accordion>
                </Paper>
            )}
        </Container>
    );
};


export default AudioRecorder;
