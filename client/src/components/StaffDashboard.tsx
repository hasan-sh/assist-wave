import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, List, ListItem, ListItemText, Accordion, AccordionSummary, AccordionDetails, FormControlLabel, Checkbox } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const API_URL = "http://localhost:5000/api";
function parseAndRenderText(text: string) {
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
};;

interface Recording {
    _id: string;
    transcription: string;
    care_instructions: {
        summary: string;
        actions: string[];
    };
    resolved: boolean;
    created_at: string;
}

const StaffDashboard: React.FC = () => {
    const [recordings, setRecordings] = useState<Recording[]>([]);

    // Fetch all recordings
    useEffect(() => {
        const fetchRecordings = async () => {
            try {
                const response = await fetch(`${API_URL}/recordings`);
                const data = await response.json();
                setRecordings(data);
            } catch (error) {
                console.error("Error fetching recordings:", error);
            }
        };

        fetchRecordings();
    }, []);

    const handleCheckboxChange = async (recording: Recording) => {
        // Send update to the backend
        const response = await fetch(`${API_URL}/update_status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ _id: recording._id, resolved: !recording.resolved }),
        });

        if (response.ok) {
            // Update the local state to reflect the change in the recording status
            setRecordings(prevRecordings =>
                prevRecordings.map(r =>
                    r._id === recording._id ? { ...r, resolved: !r.resolved } : r
                )
            );
        } else {
            console.error('Failed to update recording status');
        }
    };

    return (
        <Container maxWidth="md" sx={{mt: 5}}>
            <Typography variant="h2" gutterBottom>Staff Dashboard</Typography>
            {recordings.map((recording) => (
                <Paper key={recording._id} elevation={3}
                    style={{ position: "relative", padding: '20px', marginTop: '20px',
                        background: recording.resolved ? "palegreen" : "lightgray", 
                        opacity: recording.resolved ? .7 : 1 }}>
                    <Typography variant="h5" color="primary" gutterBottom>Patient Summary</Typography>
                    <FormControlLabel
                        control={<Checkbox checked={!!recording.resolved} onChange={() => handleCheckboxChange(recording)} />}
                        label="Resolved"
                        style={{ position: 'absolute', top: 0, right: 20 }}
                    />
                    <Typography variant="body1" style={{ fontStyle: 'italic', marginBottom: '20px' }}>
                        {parseAndRenderText(recording.care_instructions.summary)}
                    </Typography>
                    
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="actions-content" id="actions-header">
                            <Typography variant="h6" color="primary" gutterBottom>Recommended Actions</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <List>
                                {recording.care_instructions.actions.map((action, index) => (
                                    <ListItem key={index} style={{ paddingLeft: 0 }}>
                                        <ListItemText
                                            primary={<Typography variant="body1">{index + 1}. {parseAndRenderText(action)}</Typography>}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="transcription-content" id="transcription-header">
                            <Typography variant="h6" color="primary" gutterBottom>Patient's Original Input</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Paper elevation={1} style={{ padding: '15px', marginTop: '20px', fontStyle: 'italic', borderLeft: '5px solid #3f51b5' }}>
                                <Typography variant="body1">{recording.transcription}</Typography>
                            </Paper>
                        </AccordionDetails>
                    </Accordion>
                </Paper>
            ))}
        </Container>
    );
};

export default StaffDashboard;

