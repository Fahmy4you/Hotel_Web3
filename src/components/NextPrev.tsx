import React from 'react'
import { Button } from "@heroui/react";
import { useSelector } from 'react-redux';
import { RootState } from '../../libs/store';

interface Props {
    onPreviousPage: () => void;
    onNextPage: () => void;
    pages: number;
}

const NextPrev = ({ onPreviousPage, onNextPage, pages }: Props) => {
    const darkMode = useSelector((state: RootState) => state.theme);
    return (
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
            <Button
                isDisabled={pages === 1}
                size="sm"
                variant={darkMode ? "bordered" : "flat"}
                onPress={onPreviousPage}
                className={darkMode ? "text-white border-gray-600" : ""}
            >
                Previous
            </Button>
            <Button
                isDisabled={pages === 1}
                size="sm"
                variant={darkMode ? "bordered" : "flat"}
                onPress={onNextPage}
                className={darkMode ? "text-white border-gray-600" : ""}
            >
                Next
            </Button>
        </div>
    )
}

export default NextPrev