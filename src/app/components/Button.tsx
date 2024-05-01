import React from 'react'

const Button = ({ text, className }: { text: string, className: string }) => {

    const style = `text-white bg-green py-[1rem] px-[1.8rem] rounded-md ${className}`
    return (
        <button className={style}>
            {text}
        </button>
    )
}

export default Button