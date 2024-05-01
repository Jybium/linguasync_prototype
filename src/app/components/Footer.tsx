import Link from 'next/link'
import React from 'react'

import { Big_Shoulders_Stencil_Text } from 'next/font/google'
const font = Big_Shoulders_Stencil_Text({ weight: "400", subsets: ["latin"] })

const Footer = () => {
    return (
        <footer className='bg-gradient-to-b from-purple to-darkpurple text-white'>
            <div className='h-[7rem] border-b border-white w-5/6 mx-auto'>
            </div>
            <div className='w-5/6 mx-auto my-[2rem] text-center grid gap-2' style={font.style}>

                <h1 className='text-3xl'>LinguaSync</h1>
                <p>All rights reserved</p>
          
            </div>
            <hr className='h-[7px] bg-white' />

            <div className='py-4 text-sm'>
                <ul className='flex justify-between w-4/6 mx-auto'>
                    <li>
                        <Link href="/">Home</Link>
                    </li>
                    <li>
                        <Link href="/">Features</Link>
                    </li>
                    <li>
                        <Link href="/">What's new</Link>
                    </li>
                    <li>
                        <Link href="/">Speech to text</Link>
                    </li>
                    <li>
                        <Link href="/">Privacy</Link>
                    </li>
                </ul>
            </div>
        </footer>
    )
}

export default Footer