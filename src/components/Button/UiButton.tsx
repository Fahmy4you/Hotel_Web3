import React from 'react'
import { IconType } from 'react-icons';

interface UiButtonProps {
    click: () => void;
    text?: string;
    icon?: IconType;
}

const UiButton = ({ click, text, icon }: UiButtonProps) => {
    return (
        <button
            onClick={click}
            className="bg-neutral-800 dark:text-black-50 darlk:hover:bg-neutral-900 hover:bg-neutral-900 text-white px-4 py-2 rounded-md dark:bg-white dark:hover:bg-white-50"
        >
            {text}
            {icon && React.createElement(icon)}
        </button>
    )
}

export default UiButton