"use client"



import React from 'react'
import Image from 'next/image'
import Header from './components/Header'
import HeroSection from './components/HeroSection'
import image from "../../public/phone.svg"
import curveImage from "../../public/curvedEdges.png"
import languageLaptop from "../../public/languageLaptop.png"
import slidingPhone from "../../public/slidingPhone.svg"
import Button from './components/Button'
import Footer from './components/Footer'


const page = () => {
  return (
    <main>
      <section className='bg-purple'>
        <Header />
        <HeroSection />
      </section>
      <section className=' w-5/6 mx-auto my-5'>
        <h1>Why is Linguasync right for me?</h1>
        <div className='flex justify-between items-center'>
          <Image src={image} alt='Two phones' className='w-1/2 block h-1/2' />
          <div className=''>
            <p className=''>Core Functionalities of the linguasync app.</p>
            <ul className='grid gap-3'>
              <li className='text-black font-medium pl-3  border-l-[3px] border-ash'>Text to speech with customizable accents and pronounciation variations</li>
              <li className='text-black font-medium pl-3  border-l-[3px] border-ash'>Speech to text with real time feedback
                on pronunciation accuracy.</li>
              <li className='font-medium pl-3  border-l-[3px] border-green text-green'>Interactive exercises tailored to your specific sounds and accents.</li>
            </ul>

          </div>
        </div>
      </section>

      <section className='relative grid h-full'>
        <Image src={curveImage} alt='' className='w-full object-cover block absolute top-0 right-0 left-0' />

        <div className='relative top-3/4 flex justify-between w-5/6 mx-auto'>
          <div>
            <h1>Enhance your language learning with our unique features</h1>
            <ul className='grid'>
              <li className='text-black font-medium pl-3 border-l-[3px] border-ash py-3'>Speech Recognition</li>
              <li className='text-black font-medium pl-3  border-l-[3px] border-ash py-3'>Language Selections</li>
              <li className='text-black font-medium pl-3  border-l-[3px] border-ash py-3'>Progress Tracking</li>
              <li className='text-white font-medium pl-3  border-l-[3px] border-green w-fit py-3'><p className='h-8 py-1 px-2 w-fit text-center bg-green rounded-lg'>Voice controlled navigation</p></li>
              <li className='text-black font-medium pl-3  border-l-[3px] border-ash py-3'>Translation</li>
            </ul>
          </div>
          <Image src={languageLaptop} alt='laptop with words written in diffrent languages on the screen' className='w-4/5 ml-auto h-full object-cove flex justify-end' />
        </div>

      </section>

      <section className='relative flex items-center w-5/6 m-auto mt-[25rem] mb-6'>
        <div className='relative my-8'>
          <div className='h-72 w-72 bg-purple rounded-full absolute bottom-0 left-0'></div>
          <Image src={slidingPhone} alt='sliding phone' className='w-4/6 h-4/6 z-[60] relative -' />
        </div>

        <div className=' flex flex-col justify-between gap-4 text-sm'>
          <h1 className='text-xl'>Language Learning Made Easy</h1>
          <p>Linguasync makes learning a new language fun. It is Efficient and easy to use.</p>
          <Button text='Try it now' className='w-fit py-2 px-3 h-8 flex items-center shadow-md'></Button>

        </div>

      </section>

      <Footer/>
    </main>
  )
}

export default page