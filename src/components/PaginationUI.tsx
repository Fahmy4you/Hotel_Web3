import React from 'react'
import { Pagination } from '@heroui/react'
import { useSelector } from 'react-redux'
import { RootState } from '../../libs/store'

interface propsPagination{
    page: number,
    pages: number,
    setPage: (page: number) => void
}

const PaginationUI = ({ page, pages, setPage }: propsPagination) => {
    const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  return (
    <Pagination
        showControls
        showShadow
        variant="flat"
        color={darkMode ? "primary" : "secondary"}
        page={page}
        total={pages}
        onChange={setPage}
        classNames={{
          base: "gap-1",
          item: `${
            darkMode
              ? "text-white bg-black-50 hover:!bg-transparent hover:!text-primary"
              : "text-black hover:!bg-transparent hover:!text-blue-600"
          } transition-component`,
          cursor: darkMode
            ? "bg-primary text-white"
            : "bg-secondary text-white",
          ellipsis: darkMode
            ? "text-gray-400"
            : "text-default-400",
            prev: `${
              darkMode
                ? "text-white bg-black-50 hover:!bg-transparent hover:!text-primary"
                : "text-black hover:!bg-transparent hover:!text-blue-600"
            } transition-all`,
            next: `${
              darkMode
                ? "text-white bg-black-50 hover:!bg-transparent hover:!text-primary"
                : "text-black hover:!bg-transparent hover:!text-blue-600"
            } transition-component`,
          wrapper: "overflow-visible",
        }}
      />
  )
}

export default PaginationUI