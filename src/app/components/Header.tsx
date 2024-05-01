import Link from 'next/link'
import React from 'react'

import { Big_Shoulders_Stencil_Text } from 'next/font/google'
import Button from './Button'
const font = Big_Shoulders_Stencil_Text({ weight: "400", subsets: ["latin"] })

const Header = () => {
    return (
        <header className='text-white flex justify-between items-center py-3 px-5'>

            <div>
                {/* Logo */}
                <p className='text-[1.8rem]' style={font.style}>LinguaSync</p>
            </div>

            {/* Navigation */}
            <nav className='flex items-center justify-between w-3/6'>
                <ul className='flex gap-5 text-sm font-extralight'>
                    <li>
                        <Link href="/">features</Link>
                    </li>
                    <li>
                        <Link href="/transcribe">speech-to-text</Link>
                    </li>
                    <li>
                        <Link href="/">What's new</Link>
                    </li>
                    <li>
                        <Link href="/">Community</Link>
                    </li>
                </ul>

                {/* header button */}
                <Link href="/transcribe">

                    <Button text='Get started' className='text-white bg-green py-2 px-2 h-8 flex items-center w-fit text-sm'>

                    </Button>
                </Link>
            </nav>

        </header>
    )
}

export default Header