import Link from 'next/link'
import React from 'react'
import { IoIosArrowDown } from "react-icons/io";

import { Big_Shoulders_Stencil_Text } from 'next/font/google'
const font = Big_Shoulders_Stencil_Text({ weight: "400", subsets: ["latin"] })

const Header = () => {
    return (
        <header className='text-black flex justify-between items-center py-3 px-5'>

            <div>
                {/* Logo */}
                <p className='text-[1.8rem]' style={font.style}>LinguaSync</p>
            </div>

            {/* Navigation */}
            <nav className='flex items-center justify-end w-5/6'>
                <ul className='flex gap-8 text-sm font-extralight'>
                    <li>
                        <Link href="/">Donate</Link>
                    </li>
                    <li>
                        <Link href="/">Transcribe</Link>
                    </li>
                    <li>
                        <Link href="/transcribe">Speech-to-text</Link>
                    </li>
                    <li className='flex items-center gap-2'>
                        <Link href="/" >More</Link> <span><IoIosArrowDown /></span>
                    </li>
                </ul>
            </nav>

        </header>
    )
}

export default Header