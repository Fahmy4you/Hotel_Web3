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
            className="bg-gradient-to-r
            w-full sm:w-auto
            from-purple-600 to-purple-800
            text-white rounded-md p-2
            hover:from-purple-700
            hover:to-purple-900
            focus:outline-none focus:ring-2
            focus:ring-purple-500 focus:ring-opacity-50
            transition-all shadow-lg hover:shadow-xl
            text-sm font-medium flex items-center"
        >
            {text}
            {icon && React.createElement(icon)}
        </button>
    )
}

export default UiButton