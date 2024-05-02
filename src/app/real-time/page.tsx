"use client";

import React, { useState, useEffect } from 'react';

const Transcribe = () => {
    const [transcription, setTranscription] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    let mediaRecorder: MediaRecorder | null = null;

    useEffect(() => {
        // Function to handle starting the recording
        const startRecording = async () => {
            try {
                // Request access to the user's microphone
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

                // Create a new MediaRecorder instance
                mediaRecorder = new MediaRecorder(stream);

                // Create a WebSocket connection to the server
                const socket = new WebSocket('ws://localhost:3000/api/real-time'); // Adjust the URL as needed

                // Set WebSocket error and close event handlers
                socket.addEventListener('error', (error) => {
                    console.error('WebSocket error:', error);
                });

                socket.addEventListener('close', () => {
                    console.log('WebSocket connection closed.');
                });

                // Event listener for receiving messages from the server
                socket.addEventListener('message', (event) => {
                    const data = JSON.parse(event.data);
                    if (data.transcript) {
                        // Update the transcription state
                        setTranscription((prev) => `${prev} ${data.transcript}`);
                    }
                });

                // Event listener for handling recorded audio data
                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        // Send the audio data to the server
                        socket.send(event.data);
                    }
                };

                // Start recording audio
                mediaRecorder.start();
                setIsRecording(true);
                setSocket(socket);
            } catch (error) {
                console.error('Error starting recording:', error);
            }
        };

        // Function to handle stopping the recording
        const stopRecording = () => {
            if (mediaRecorder) {
                mediaRecorder.stop();
                setIsRecording(false);
            }

            if (socket) {
                socket.close(); // Close the WebSocket connection
                setSocket(null);
            }
        };

        // Start recording when the component mounts
        startRecording();

        // Clean up the recording when the component unmounts
        return () => {
            stopRecording();
        };
    }, []);

    return (
        <div>
            <h2>Real-Time Transcription</h2>
            <p>Transcription: {transcription}</p>
            {isRecording ? (
                <p>Recording...</p>
            ) : (
                <p>Stopped</p>
            )}
        </div>
    );
};

export default Transcribe;
