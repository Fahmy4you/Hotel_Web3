import React from 'react'
import { RiPencilLine } from 'react-icons/ri'
import { FaTrashAlt } from 'react-icons/fa'
import { Button } from '@heroui/react'
import { FaRegEye } from "react-icons/fa6";


interface ActionButtonProps {
    onEdit: () => void
    onDelete: () => void
    showDetailButton?: boolean
    onDetail?: () => void
}

const ActionButton = ({ onEdit, onDelete, showDetailButton = false, onDetail }: ActionButtonProps) => {
    return (
        <>
            {showDetailButton && onDetail ? (
                <div className="space-x-2">
                    <Button
                        isIconOnly
                        size="sm"
                        className=" text-blue-500 bg-blue-900/10 border border-blue-500/50 hover:bg-blue-900/20 hover:shadow-[0_0_5px_rgba(59, 130, 246, 0.6)] transition-all duration-200 text-xs"
                        onPress={onDetail}
                    >
                        <FaRegEye className="h-5 w-5" />
                    </Button>
                    <Button
                        isIconOnly
                        size="sm"
                        className=" text-yellow-500 bg-yellow-900/10 border border-yellow-500/50 hover:bg-yellow-900/20 hover:shadow-[0_0_5px_rgba(234,179,8,0.5)] transition-all duration-200 text-xs"
                        onPress={onEdit}
                    >
                        <RiPencilLine className="h-5 w-5" />
                    </Button>
                    <Button
                        className='text-red-500 bg-red-900/10 border border-red-500/50 hover:bg-red-900/20 hover:shadow-[0_0_5px_rgba(239,68,68,0.5)] transition-all duration-200 text-xs'
                        size="sm"
                        isIconOnly
                        onPress={onDelete}
                    >
                        <FaTrashAlt className="h-5 w-5" />
                    </Button>
                </div>
            ) : (
                <div className="space-x-2">
                    <Button
                        size="sm"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-yellow-500 bg-yellow-900/10 border border-yellow-500/50 hover:bg-yellow-900/20 hover:shadow-[0_0_5px_rgba(234,179,8,0.5)] transition-all duration-200 text-xs"
                        onPress={onEdit}
                    >
                        Edit <RiPencilLine className="h-5 w-5" />
                    </Button>
                    <Button
                        size="sm"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-red-500 bg-red-900/10 border border-red-500/50 hover:bg-red-900/20 hover:shadow-[0_0_5px_rgba(239,68,68,0.5)] transition-all duration-200 text-xs"
                        onPress={onDelete}
                    >
                        Hapus <FaTrashAlt className="h-5 w-5" />
                    </Button>
                </div>
            )}
        </>
    )
}

export default ActionButton