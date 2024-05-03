"use client"

import React, { useState, useEffect, useRef } from "react";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import Footer from "../components/Footer";
import MainBody from "./components/MainBody";
import { FaRegKeyboard } from "react-icons/fa";

import { CiMicrophoneOn } from "react-icons/ci";
import { IoIosSend } from "react-icons/io";
import { IoStopSharp } from "react-icons/io5";
import toast from "react-hot-toast";





export default function Home() {
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
        null
    )
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    const [preferred, setPreferredLanguage] = useState<string>("en-US")
    const [data, setData] = useState<[] | undefined>([])
    const [audioChunks, setAudioChunks] = useState<string>();
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
            const data = localStorage.getItem("data");
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
    }, [loading]);

    function addRequestResponsePair(request: string, response: string) {
        const key = 'data';
        const counterKey = 'idCounter';

        const existingData = localStorage.getItem(key);
        let data = existingData ? JSON.parse(existingData) : [];

        let idCounter = localStorage.getItem(counterKey);
        let currentCounter = idCounter ? parseInt(idCounter, 10) : 0;

        currentCounter += 1;

        const newObject = {
            id: currentCounter,
            request: request,
            response: response,
        };

        data.push(newObject);

        const jsonData = JSON.stringify(data);
        localStorage.setItem(key, jsonData);

        localStorage.setItem(counterKey, currentCounter.toString());
    }


    const getTranslation = async () => {

        const formData = {
            text: input,
            targetLang: preferred
        }

        try {
            setLoading(true)

            const response = await fetch("/api/translate", {
                method: "POST",
                body: JSON.stringify(formData),

            });

            if (!response.ok) {
                toast.error("Failed to generate translation")
                throw new Error("Failed to generate translation");
            }

            const data = await response.json();
            toast.success("Success")
            console.log("Translation generated successfully:", data);
            addRequestResponsePair(input, data.translatedText || "Couldn't get translation.")
            setLoading(false)

            setInput('')

        } catch (error) {
            toast.error("An error has occured!")

            console.error("Error generating translation:", error);

            setLoading(false)
            

        } finally {
            setLoading(false)

        }
    }


    const getAudio = async (text: string, id: string) => {

        setSelectedItemId(id)

        const requestData = {
            text,
            lang: preferred
        }

        try {
            const response = await fetch("/api/text-to-speech", {
                method: "POST",
                body: JSON.stringify(requestData),

            });

            if (!response.ok) {
                toast.error("Failed to upload audio file")
                throw new Error("Failed to upload audio file");
            }

            const data = await response.json();
            toast.success("Success")

            const binaryData = data.data
            console.log(binaryData)

            const audioUint8Array = new Uint8Array(binaryData.data);

            const audioBlob = new Blob([audioUint8Array], { type: 'audio/mpeg' }); 

            const audioURL = URL.createObjectURL(audioBlob);

            setAudioChunks(audioURL);
        } catch (error) {
            toast.error("An error has occured!")
            console.error("Error uploading audio file:", error);
            setAudioChunks("");
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
            <MainBody preferred={preferred} setPreferredLanguage={setPreferredLanguage}>
                <div className="flex flex-col justify-between mt-10 h-[50vh] overflow-y-auto">


                    {!data && <h1>Start typing to translate</h1>}

                    <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
                        {
                            data?.map((item: { request: string; response: string, id: string }) => (
                                <div key={item.id}>
                                    {item?.request && (
                                        <p className="">{item.request}</p>
                                    )}

                                    {item?.response && <p className="mt-2 flex justify-end cursor-pointer" onClick={(e) => {

                                        const text = (e.target as HTMLElement)?.textContent ?? '';
                                        getAudio(text, item.id);
                                    }}>
                                        {item.response}
                                    </p>
                                    }
                                    {/* Display translated text if the item ID matches the selected ID */}
                                    {selectedItemId === item.id && audioChunks && (
                                 
                                        <audio
                                            src={audioChunks}
                                            controls
                                            onEnded={() => setIsPlaying(false)}
                                            onTimeUpdate={() => setPlaybackTime(audioRef.current?.currentTime || 0)}
                                            className="flex justify-end mt-2"
                                        />
                                    )}
                                </div>
                            ))
                        }
                    </div>
                    <div className="flex justify-between items-center w-full">
                        <div className="relative w-4/6">
                            <input value={input} onChange={(e) => setInput(e.target.value)} type="text" className="w-full h-8 px-2 pr-10  border border-black rounded relative text-wrap text-sm" />
                            {/* <textarea name="" id="" cols={30} rows={10}></textarea> */}
                            <FaRegKeyboard className="absolute right-3 bottom-[10px]" />
                        </div>

                        <div className="flex md:flex-row flex-col gap-3 items-end text-sm">
                            {loading ? <p>Processing ...</p> : <p>{input.length} words</p>}
                            {input.length !== 0 &&
                                <button onClick={getTranslation} disabled={audioChunks?.length === 0} className="h-10 w-10 bg-green rounded-full flex items-center justify-center text-center">
                                    <IoIosSend size={30} color="white" />
                                </button>
                            }

                        </div>
                    </div>

                </div>

            </MainBody>
            <div className="my-6 bg-ash h-[50vh] overflow-y-auto w-5/6 mx-auto rounded-sm">
                <div className="w-[95%] mx-auto my-4">


                    <h1>Review Conversations</h1>
                    <p>Translate your words and Phrases</p>
                </div>

                <div className="bg-white rounded-sm p-3 w-[95%] mx-auto overflow-y-auto">
                    {!data && "You have no conversations yet"}
                    {data && <div className="flex flex-col flex-1 overflow-y-auto">
                        {
                            data?.map((item: { request: string; response: string }) => (
                                <div key={item.request || item.response}>
                                    {item?.request && (
                                        <p className="mt-2 flex">{item.request}</p>
                                    )}
                                    {item?.response && <p className="mt-2 flex justify-end text-red-600">{item.response}</p>}
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
