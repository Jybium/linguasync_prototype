import React from 'react'

import { Noto_Serif } from 'next/font/google'

const inter = Noto_Serif({ weight: "400", subsets: ["latin"] })

const HeroSection = () => {
  return (
    <div className='h-[50vh] bg-purple grid content-center' >
        <div className='w-1/2 pl-[3rem] grid gap-5 text-white text-sm'>
                <p className='flex items-center'>Home <span className='px-2 text-bas'>&gt;</span> text-to-speech</p>
              <h1 className='text-4xl' style={inter.style}>Text-to-Speech</h1>
              <p>Learn a new language with real time feedback on pronunciation accuracy. Automatically convert text to text and then to speech.</p>
        </div>
    </div>
  )
}

export default HeroSection