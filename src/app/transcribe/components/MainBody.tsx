"use client"

import React, { useState } from 'react'

const MainBody = ({ children }: { children: React.ReactNode }) => {
    const [preferred, setPreferredLanguage] = useState("")

    const getUserPreferredLanguage = () => {
        // Obtain the user's preferred language from the browser settings
        const userLanguage = navigator.language

        // Set the preferred language state
        setPreferredLanguage(userLanguage);
    };

    return (
        <div className='my-5 mt-10 w-5/6 mx-auto'>
            <div className='flex justify-between items-start w-full'>

                <div className='border-t border-green relative w-4/6'>

                    <div className='absolute -top-4 -left-8 w-fit right-0 ml-auto flex items-center gap-3 border border-green bg-white rounded-md p-1 '>
                        <p onClick={getUserPreferredLanguage}>Detect language</p>
                        <select name="language" id="lang">
                            <option value={preferred}>{preferred}</option>
                            <option value="korean">Korean</option>
                            <option value="russia">Russia</option>
                            <option value="german">German</option>
                        </select>
                    </div>

                    <div className='pr-3'>
                        {children}
                    </div>
                </div>

                <div className='bg-ash w-2/6 px-3 py-2 h-[55vh] rounded-sm text-sm'>
                    <p>Pronounciation Feedback</p>
                    <p className='mt-1'>Click to get <span className='text-red-500 underline'>started</span></p>
                </div>
            </div>
        </div>
    )
}

export default MainBody