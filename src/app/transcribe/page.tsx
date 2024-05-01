"use client"

import React, { useState, useEffect, useRef } from "react";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import Footer from "../components/Footer";
import MainBody from "./components/MainBody";

import { CiMicrophoneOn } from "react-icons/ci";
import { IoIosSend } from "react-icons/io";
import { IoStopSharp } from "react-icons/io5";





export default function Home() {
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
        null
    );
    const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
    const [blobs, setBlob] = useState<Blob[] | []>([]);
    const [recording, setRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [playbackTime, setPlaybackTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (recording) {
            interval = setInterval(() => {
                setRecordingTime((prev) => prev + 1);
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [recording]);


    useEffect(() => {

    }, [audioChunks]);

    useEffect(() => {
        if (isPlaying) {
            const updatePlaybackTime = () => {
                if (audioRef.current) {
                    setPlaybackTime(audioRef.current.currentTime);
                }
            };

            const interval = setInterval(updatePlaybackTime, 1000);

            return () => clearInterval(interval);
        }
    }, [isPlaying]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            setMediaRecorder(recorder);
            setRecordingTime(0);
            // setAudioChunks([]);

            recorder.ondataavailable = (event) => {
                // console.log('New data chunk:', event.data);
                setAudioChunks((prevChunks) => [...prevChunks, event.data]);
                // setBlob((prevChunks) => [...prevChunks, event.data])
                // console.log('Current audio chunks:', audioChunks);
            };

            recorder.start();
            setRecording(true);
        } catch (error) {
            console.error("Error accessing microphone", error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder && mediaRecorder.state !== "inactive") {
            mediaRecorder.stop();
            setRecording(false);
        }

        // const completeBlob = new Blob(audioChunks, { type: "audio/wav" });
        // console.log("Complete audio blob:", blobs);
    };

    const sendAudio = async () => {
        const blob = new Blob(audioChunks, { type: "audio/wav" });
        console.log(blob)
        const formData = new FormData();
        formData.append("audio", blob, "recording.wav");

        try {
            const response = await fetch("/api/transcribe", {
                method: "POST",
                body: formData,
               
                // mode: "cors",  // Use cors mode
            });

            if (!response.ok) {
                throw new Error("Failed to upload audio file");
            }

            const data = await response.json();
            console.log("Audio file uploaded successfully:", data);
            setAudioChunks([]);
        } catch (error) {
            console.error("Error uploading audio file:", error);
            setAudioChunks([]);
        }

    };

    const handleAudioPlayback = () => {
        if (audioChunks.length > 0) {
            const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
            const audioUrl = URL.createObjectURL(audioBlob);
            if (audioRef.current) {
                audioRef.current.src = audioUrl;
                audioRef.current.play();
                setIsPlaying(true);
            }
        }
    };

    const handlePlaybackToggle = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying((prev) => !prev);
        }
    };

    return (
        <main className="containe">
            <Header />
            <HeroSection />
            <MainBody>
                <div className="flex flex-col justify-between mt-10 h-[50vh] overflow-y-auto">


                    <h1>Click the mic to start dictating</h1>
                    <div className="flex justify-between items-center">


                        <button onClick={startRecording} disabled={recording} className="h-10 w-10 bg-green rounded-full flex items-center justify-center text-center">
                            <CiMicrophoneOn size={30} color="white" />
                        </button>


                        {/* <button onClick={stopRecording} disabled={!recording}>
                            Stop
                        </button>
                        <button onClick={sendAudio} disabled={audioChunks.length === 0} className="h-10 w-10 bg-green rounded-full flex items-center justify-center text-center">
                            <IoIosSend size={30} color="white" />
                        </button>
                        <button onClick={handleAudioPlayback} disabled={recording}>
                            Playback
                        </button>
                        <audio
                            ref={audioRef}
                            controls
                            onEnded={() => setIsPlaying(false)}
                            onTimeUpdate={() => setPlaybackTime(audioRef.current?.currentTime || 0)}
                        /> */}
                        <div className="flex gap-3 items-end ">
                            <div>
                                {recording && <p>Recording Time: {recordingTime} seconds</p>}
                                {isPlaying && <p>Playback Time: {Math.floor(playbackTime)} seconds</p>}
                            </div>
                            {!recording && <p>0 words</p>}
                            {!recording && audioChunks.length !== 0 &&
                                <button onClick={sendAudio} disabled={audioChunks.length === 0} className="h-10 w-10 bg-green rounded-full flex items-center justify-center text-center">
                                    <IoIosSend size={30} color="white" />
                                </button>
                            }
                            {recording && <button onClick={stopRecording} disabled={!recording} className="h-10 w-10 bg-green rounded-full flex items-center justify-center text-center">
                                <IoStopSharp size={27} color="white" />
                            </button>}
                        </div>
                    </div>

                </div>

            </MainBody>
            <div className="my-6 bg-ash h-[50vh] overflow-y-auto w-5/6 mx-auto rounded-sm">
                <div className="w-[95%] mx-auto my-4">


                    <h1>Review Conversations</h1>
                    <p>Practice mispronouced words and Phrases</p>
                </div>

                <div className="bg-white rounded-sm p-3 w-[95%] mx-auto">
                    You have no conversations yet
                </div>
            </div>

            <Footer />
        </main>
    );
}
