"use client"

import React, { ReactEventHandler, useState } from 'react'

const MainBody = ({ children, preferred, setPreferredLanguage }: { children: React.ReactNode, preferred: string, setPreferredLanguage: (v: string) => void }) => {

    const getUserPreferredLanguage = () => {
        // Obtain the user's preferred language from the browser settings
        const userLanguage = navigator.language
        // Set the preferred language state
        setPreferredLanguage(userLanguage);
    };

    const handleLanguageChange = (event: any) => {
        setPreferredLanguage(event.target.value);
    };

    return (
        <div className='my-5 mt-10 w-5/6 mx-auto'>
            <div className='flex justify-between items-start w-full'>

                <div className='border-t border-green relative w-4/6'>

                    <div className='absolute -top-4 -left-8 w-fit right-0 ml-auto flex items-center gap-3 border border-green bg-white rounded-md p-1 '>
                        <p onClick={getUserPreferredLanguage}>Detect language</p>
                        <select name="language" id="lang" onChange={handleLanguageChange}>
                            <option value={preferred}>{preferred}</option>
                            <option value="ko-KR">Korean</option>
                            <option value="ru-RU">Russia</option>
                            <option value="de-DE">German</option>
                            <option value="fr-FR">France - French</option>
                        </select>
                    </div>

                    <div className='pr-3'>
                        {children}
                    </div>
                </div>

                <div className='bg-ash w-2/6 px-3 py-2 h-[55vh] rounded-sm text-sm flex flex-col justify-between'>
                    <div>

                        <p>Pronounciation Feedback</p>
                        <p className='mt-1'>Click to get <span className='text-red-500 underline'>started</span></p>
                        <p className='mt-3'>1. Click on any of the responses to get the translation in audio.</p>
                        <p className='mt-3'>2. Translations are in english unless changed in the select menu above.</p>
                    </div>
                    <a href='' className='bg-green flex justify-end items-center text-white h-8 w-fit py-1 px-3 rounded-md' onClick={() => localStorage.clear()}>Clear History</a>
                </div>
            </div>
        </div>
    )
}

export default MainBody