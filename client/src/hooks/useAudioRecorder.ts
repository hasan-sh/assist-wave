import { useState, useRef } from 'react';

export const useAudioRecorder = () => {
    const [recording, setRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

    const startRecording = async () => {
        try {
            // Try getting the user's media (microphone)
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);

            mediaRecorderRef.current.ondataavailable = (event) => {
                setAudioBlob(event.data); // Save the blob data as audio
            };

            mediaRecorderRef.current.start();
            setRecording(true);
        } catch (error) {
            alert('Permission denied for microphone access');
        }
    };

    const stopRecording = () => {
        mediaRecorderRef.current?.stop();
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
                return result;
            } catch (error) {
                console.error(error);
            }
        }
    };

    return {
        recording,
        startRecording,
        stopRecording,
        audioBlob,
        sendAudioToBackend,
    };
};
