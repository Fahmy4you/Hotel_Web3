import { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@heroui/react';
// import UiButton from '../Button/UiButton';

interface TableHeaderProps<T> {
  title: string;
  placeholder?: string;
  onSearch: (query: string) => void;
  addButtonText?: string;
  onAddButtonClick?: () => void;
}

const TableHeader = <T,>({
  title,
  placeholder = `Search ${title.toLowerCase()}...`,
  onSearch,
  addButtonText = 'Add New',
  onAddButtonClick,
}: TableHeaderProps<T>) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <div className="p-4 border-b rounded-t-lg bg-gray-100 border-gray-200 dark:bg-gray-900 dark:border-gray-800">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={placeholder}
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg border-gray-300 text-neutral-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <Button className="bg-neutral-800 dark:text-black-50 darlk:hover:bg-neutral-900 hover:bg-neutral-900 text-white px-4 py-2 rounded-md dark:bg-white dark:hover:bg-white-50 font-medium" onPress={onAddButtonClick}>{addButtonText}</Button>
        </div>
      </div>
    </div>
  );
};

export default TableHeader;