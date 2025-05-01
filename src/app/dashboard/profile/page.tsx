'use client'
import React from 'react'
import { useSelector } from 'react-redux'
import { Tooltip, Button, useDisclosure, Input } from '@heroui/react'
import Modals from '@/components/Modals'
import { PencilIcon } from 'lucide-react'
import { RiMailLine } from "react-icons/ri";
import { RootState } from '../../../../libs/store'
import Image from 'next/image'

const Page = () => {
    const darkMode = useSelector((state: RootState) => state.theme.darkMode);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return (
        <div className={`${darkMode ? 'bg-body text-white-50' : 'bg-white text-gray-900'} transition-bg overflow-hidden`}>
            <h1 className={`text-xl font-bold transition-component ${darkMode ? 'text-white-50' : 'text-gray-900'}`}>Profile</h1>
            <div className="flex mt-5 gap-3">
                <div className={`flex flex-col ${darkMode ? 'bg-black-100 text-white-50' : 'bg-gray-100 text-gray-900'} w-[400px] h-[470px] rounded-lg p-5`}>
                    <div className="w-[170px] h-[150px] bg-amber-50 relative rounded-lg overflow-hidden">
                        <Image
                            src="/image/visi.jpeg"
                            alt="Profile Image"
                            fill
                            style={{ objectFit: 'cover' }}
                            className="rounded-lg"
                        />
                        <div className="absolute bottom-2 right-2">
                            <Tooltip content="Change Profile" placement="right-end" color="secondary">
                                <button onClick={onOpen} className={`rounded-full p-2 cursor-pointer hover:opacity-90 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                    <PencilIcon size={16} />
                                </button>
                            </Tooltip>
                        </div>
                    </div>
                    <Button color="secondary" variant="ghost" className="mt-4">
                        Edit Profile
                    </Button>
                </div>

                <div className={`flex w-screen flex-col rounded-lg p-5 ${darkMode ? 'bg-black-100 text-white-50' : 'bg-gray-100 text-gray-900'}`}>
                    <h1 className='text-xl font-bold'>Your Information</h1>
                    <div className="flex flex-col gap-3 mt-5">
                    <Input label="Username" className={`${darkMode ? 'bg-black-100 text-white-50' : 'bg-gray-100 text-gray-900'}`} labelPlacement="outside" placeholder="you@example.com" startContent={ <RiMailLine className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />} type="email" />
                    <Input label="Email" labelPlacement="outside" placeholder="you@example.com" startContent={ <RiMailLine className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />} type="email" />
                    <Input label="No. WhatsApp" labelPlacement="outside" placeholder="you@example.com" startContent={ <RiMailLine className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />} type="email" />
                    <Input label="Role" labelPlacement="outside" placeholder="you@example.com" startContent={ <RiMailLine className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />} type="email" />
                    </div>
                </div>
            </div>

            <Modals isOpen={isOpen} onOpenChange={onOpenChange} />
        </div>
    )
}

export default Page;
