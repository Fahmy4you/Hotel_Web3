import React, { useState } from 'react';
import { Search } from 'lucide-react';
import UserModal from '../Modals/AddEditModals';
import UiButton from '../UiButton';
import { UserData } from '../../../types/userData';

interface TableHeaderProps {
  onSearch: (query: string) => void;
  onAddUser?: (userData: UserData) => void;
}

// export interface UserData {
//   id?: number;
//   name: string;
//   wallet: string;
//   role: string;
// }

const TableHeader: React.FC<TableHeaderProps> = ({ onSearch, onAddUser }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleOpenModal = (): void => setIsModalOpen(true);
  const handleCloseModal = (): void => setIsModalOpen(false);
  
  const handleSubmitUser = (userData: UserData): void => {
    if (onAddUser) {
      onAddUser(userData);
    }
    handleCloseModal();
  };

  return (
    <>
      <div className="dark:bg-gray-900 p-4 border-b dark:border-gray-800 transition-all bg-gray-100 border-gray-200 rounded-t-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold dark:text-white text-gray-900">User Management</h2>
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 text-neutral-900 border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <UiButton click={handleOpenModal} text="Add User" />
          </div>
        </div>
      </div>

      <UserModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        mode="add"
        onSubmit={handleSubmitUser}
      />
    </>
  );
};

export default TableHeader;