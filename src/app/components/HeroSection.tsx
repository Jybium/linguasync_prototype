import Image from 'next/image'
import React from 'react'

import { Noto_Serif } from 'next/font/google'

const inter = Noto_Serif({ weight: "400", subsets: ["latin"] })

import HeroImage from "../../../public/heroLaptop.svg"
import Button from './Button'

const HeroSection = () => {
    return (
        <div className='bg-purple h-[70vh] w-full grid justify-center'>
            <div className='w-5/6 m-auto h-[60vh]'>

                <div className='md:flex grid justify-between items-center text-white'>
                    <div className='flex flex-col justify-between h-[45vh]'>
                        <h1 className='text-3xl font-bold' style={inter.style}>Realistic Language Learning Services Just for You</h1>
                        <p>Linguasync is the number one Language learning app For personal, commercial and educational use.</p>
                        <Button text='Try for free' className='w-fit py-1 px-2 shadow-lg'>
                        </Button>
                    </div>
                    <div className=''>
                        <Image src={HeroImage} alt='' className='' />
                    </div>
                </div>
            </div>

        </div>
    )
}

export default HeroSection