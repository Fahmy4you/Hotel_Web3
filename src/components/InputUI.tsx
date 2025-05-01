import React from 'react'
import { Input } from '@heroui/react'
import { RiMailLine } from "react-icons/ri";


interface InputUIProps {
    type: string,
    placeholder: string,
    label: string,
}

const InputUI = () => {
    return (
        <Input
            label="Email"
            labelPlacement="outside"
            placeholder="you@example.com"
            startContent={
                <RiMailLine className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
            }
            type="email"
        />
    )
}

export default InputUI