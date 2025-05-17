import React from 'react';
import { Pagination } from '@heroui/react';

interface TableFooterProps {
  itemCount: number;
  itemName: string;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
}

const TableFooter: React.FC<TableFooterProps> = ({
  itemCount,
  itemName,
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
}) => {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-gray-100 dark:bg-black-50">
      <p className="text-sm text-gray-700 dark:text-gray-300">
        Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
        <span className="font-medium">{Math.min(currentPage * itemsPerPage, itemCount)}</span> of{' '}
        <span className="font-medium">{itemCount}</span> {itemName}
      </p>
      <Pagination
        page={currentPage}
        total={totalPages}
        onChange={onPageChange}
        showControls
        boundaries={1}
        siblings={1}
        className="flex items-center gap-2"
      />
    </div>
  );
};

export default TableFooter;