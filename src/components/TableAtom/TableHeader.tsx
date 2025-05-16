import { useState } from 'react';
import { Search } from 'lucide-react';
import UiButton from '@/components/Button/UiButton';
import { IoRefresh } from 'react-icons/io5';

interface TableHeaderProps<T> {
  title: string;
  placeholder?: string;
  onSearch: (query: string) => void;
  addButtonText?: string;
  onAddButtonClick?: () => void;
  handleRefresh?: () => void; 
  initialData?: T; 
}

const TableHeader = <T extends unknown>({
  title,
  onSearch,
  addButtonText = 'Add New', // default text jika tidak diberikan
  initialData,
  placeholder = `Search ${title.toLowerCase()}...`,
  onAddButtonClick,
  handleRefresh
}: TableHeaderProps<T>) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <>
      <div className="dark:bg-gray-900 p-4 border-b dark:border-gray-800 transition-all bg-gray-100 border-gray-200 rounded-t-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-lg font-semibold dark:text-white text-gray-900">{title}</h2>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={placeholder}
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 pr-4 py-2 w-full border dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 text-neutral-900 border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {handleRefresh && (
                <UiButton click={handleRefresh} icon={IoRefresh}/>
            )}
            
              <UiButton
                click={() => onAddButtonClick} 
                text={addButtonText}
                // className="w-full sm:w-auto"
              />
          </div>
        </div>
      </div>
    </>
  );
};

export default TableHeader;