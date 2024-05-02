"use client"

import React, { useState, useEffect, useRef } from "react";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import Footer from "../components/Footer";
import MainBody from "./components/MainBody";

import { CiMicrophoneOn } from "react-icons/ci";
import { IoIosSend } from "react-icons/io";
import { IoStopSharp } from "react-icons/io5";
import toast from "react-hot-toast";





export default function Home() {
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
        null
    );
    const [loading, setLoading] = useState(false)
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    const [preferred, setPreferredLanguage] = useState<string>("en-US")
    const [translatedText, setTranslatedText] = useState<string>("")
    const [data, setData] = useState<[] | undefined>([])
    const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
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


    useEffect(() => {
        try {
            const data = sessionStorage.getItem("data");
            if (data) {
                const parsedData = JSON.parse(data);
                setData(parsedData);
                console.log(parsedData);
            } else {
                console.log('No data found in the store.');
            }
        } catch (error) {
            console.error('Error parsing data from store:', error);
        }
    }, [audioChunks, data]);

    function addRequestResponsePair(request: string, response: string) {
        const key = 'data';
        const counterKey = 'idCounter';

        const existingData = sessionStorage.getItem(key);
        let data = existingData ? JSON.parse(existingData) : [];

        let idCounter = sessionStorage.getItem(counterKey);
        let currentCounter = idCounter ? parseInt(idCounter, 10) : 0;

        currentCounter += 1;

        const newObject = {
            id: currentCounter,
            request: request,
            response: response,
        };

        data.push(newObject);

        const jsonData = JSON.stringify(data);
        sessionStorage.setItem(key, jsonData);

        sessionStorage.setItem(counterKey, currentCounter.toString());
    }



    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            setMediaRecorder(recorder);
            setRecordingTime(0);


            recorder.ondataavailable = (event) => {
                setAudioChunks((prevChunks) => [...prevChunks, event.data]);
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


    };

    const sendAudio = async () => {
        const blob = new Blob(audioChunks, { type: "audio/wav" });
        console.log(blob)
        const audioUrl = URL.createObjectURL(blob);
        const formData = new FormData();
        formData.append("audio", blob, "recording.wav");

        try {
            setLoading(true)
            const response = await fetch("/api/transcribe", {
                method: "POST",
                body: formData,

            });

            if (!response.ok) {
                toast.error("Failed to upload audio file")
                throw new Error("Failed to upload audio file");
            }

            const data = await response.json();
            toast.success("Success")
            console.log("Audio file uploaded successfully:", data);
            addRequestResponsePair(audioUrl, data.transcript || "Couldn't get transcript. Use clear audio")
            setAudioChunks([]);
            setLoading(false)
        } catch (error) {
            toast.error("An error has occured!")

            console.error("Error uploading audio file:", error);
            setAudioChunks([]);
            setLoading(false)

        } finally{
            setLoading(false)
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


    const getTranslation = async (text: string, id: string) => {

        setSelectedItemId(id);

        const formData = {
            text: text,
            targetLang: preferred
        }

        try {
            setLoading(true)

            const response = await fetch("/api/translate", {
                method: "POST",
                body: JSON.stringify(formData),

            });

            if (!response.ok) {
                toast.error("Failed to upload audio file")
                throw new Error("Failed to upload audio file");
            }

            const data = await response.json();
            toast.success("Success")
            console.log("Audio file uploaded successfully:", data);
            setTranslatedText(data.translatedText);
            setLoading(false)

        } catch (error) {
            toast.error("An error has occured!")

            console.error("Error uploading audio file:", error);
            setAudioChunks([]);
            setLoading(false)

        }finally{
            setLoading(false)

        }
    }


    return (
        <main className="containe">
            <Header />
            <HeroSection />
            <MainBody preferred={preferred} setPreferredLanguage={setPreferredLanguage}>
                <div className="flex flex-col justify-between mt-10 h-[50vh] overflow-y-auto">


                    {!data && <h1>Click the mic to start dictating</h1>}

                    <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
                        {
                            data?.map((item: { request: string; response: string, id: string }) => (
                                <div key={item.id}>
                                    {item?.request && (
                                        <audio
                                            src={item.request}
                                            controls
                                            onEnded={() => setIsPlaying(false)}
                                            onTimeUpdate={() => setPlaybackTime(audioRef.current?.currentTime || 0)}
                                        />
                                    )}

                                    {item?.response && <p className="mt-2 flex justify-end" onClick={(e) => {

                                        const text = (e.target as HTMLElement)?.textContent ?? '';
                                        getTranslation(text, item.id);
                                    }}>
                                        {item.response}
                                    </p>
                                    }
                                    {/* Display translated text if the item ID matches the selected ID */}
                                    {selectedItemId === item.id && (
                                        <p className="mt-2 flex justify-end">{translatedText}</p>
                                    )}
                                </div>
                            ))
                        }
                    </div>
                    <div className="flex justify-between items-center">

                        <button onClick={startRecording} disabled={recording} className="h-10 w-10 bg-green rounded-full flex items-center justify-center text-center">
                            <CiMicrophoneOn size={30} color="white" />
                        </button>


                        <div className="flex gap-3 items-end ">
                            <div>
                                {recording && <p>Recording Time: {recordingTime} seconds</p>}
                                {isPlaying && <p>Playback Time: {Math.floor(playbackTime)} seconds</p>}
                            </div>
                            {!recording && !loading && <p>0 words</p>}
                            {!recording && loading && <p>Processing ...</p>}
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

                <div className="bg-white rounded-sm p-3 w-[95%] mx-auto overflow-y-auto">
                    {!data && "You have no conversations yet"}
                    {data && <div className="flex flex-col flex-1 overflow-y-auto">
                        {
                            data?.map((item: { request: string; response: string }) => (
                                <div key={item.request || item.response}>
                                    {item?.request && (
                                        <audio
                                            src={item.request}
                                            controls
                                            onEnded={() => setIsPlaying(false)}
                                            onTimeUpdate={() => setPlaybackTime(audioRef.current?.currentTime || 0)}
                                        />
                                    )}
                                    {item?.response && <p className="mt-2 flex justify-end">{item.response}</p>}
                                </div>
                            ))
                        }
                    </div>}
                </div>
            </div>

            <Footer />
        </main>
    );
}
