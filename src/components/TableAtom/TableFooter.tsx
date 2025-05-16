import React from 'react'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa'
import UiButton from '@/components/Button/UiButton'


const TableFooter = ({ itemCount, itemName, onPrev, onNext }: {
    itemCount: number;
    itemName: string;
    onPrev: () => void;
    onNext: () => void;
  }) => (
    <div className="dark:bg-black-50 bg-gray-100 px-6 py-4 border-t border-gray-400 dark:border-gray-800 transition-colors">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium">{itemCount}</span> {itemName}
        </div>
        <div className="flex space-x-2">
          <UiButton click={onPrev} icon={FaAngleLeft} />
          <UiButton click={onNext} icon={FaAngleRight} />
        </div>
      </div>
    </div>
  );
export default TableFooter