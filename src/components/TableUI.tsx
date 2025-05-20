'use client';
import React, { useState, useEffect } from 'react';
import { FaAngleLeft, FaAngleRight, FaTrashAlt } from "react-icons/fa";
import { RiPencilLine } from "react-icons/ri";
import { ArrowUpDown } from 'lucide-react';
import { GetAllUser } from '@/app/Server/Users/GetAllUser';
import RoleBadge from './TableAtom/RoleBadge';
import WalletAddress from './TableAtom/WalletAddress';
import TableHeader from './TableAtom/TableHeader';
import UiButton from './Button/UiButton';
import UserModal from './Modals/Users/UsersMoadal';

import { UserData } from '../types/userData';
import SuccessAlert from './Alert/SuccessAllert';
import ConfirmModal from './Modals/DeleteModalDialog';
import { deleteUser } from '@/app/Server/Users/DeleteUser';

interface ModernTableUIProps {
  onSearch: (query: string) => void;
  onAddUser: (userData: UserData) => void;
  onEditUser?: (userData: UserData) => void;
}

const ModernTableUI: React.FC<ModernTableUIProps> = ({ onEditUser, onAddUser, onSearch }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [query, setQuery] = React.useState('');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [data, setData] = React.useState<any[]>([]);
  const [deleting, setDeleting] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await GetAllUser({ search: query, page: 1 });
      setData(response.users);
    };
    fetchData();
  }, []);

  const filteredData = data.filter(user => {
    const userName = user.nama || '';
    const searchQuery = query || '';
    return userName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
    setCurrentUser(null);
  };

  const handleEditUser = (user: UserData): void => {
    setIsEditMode(true);
    setCurrentUser(user);
    setIsModalOpen(true);
  };


  const handleDeleteUser = (user: UserData): void => {
    if (user.id === undefined) return;
    setSelectedUserId(user.id);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteUser = async (userId: number) => {
    setDeleting(true);
    try {
      await deleteUser(userId);
      const response = await GetAllUser({ search: query, page: 1 });
      setData(response.users);
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setDeleting(false);
      setIsDeleteModalOpen(false);
    }
  }


  const handlerSubmit = async (user: UserData) => {
    if (isEditMode && onEditUser) {
      try {
        onEditUser({ ...user, id: currentUser?.id });
        const response = await GetAllUser({ search: query, page: 1 });
        setData(response.users);
      } catch (error) {
        console.error("Error editing user:", error);
      }
    }
    handleCloseModal();
  }
  return (
    <div className="w-full dark:bg-black-50 transition-bg bg-gray-100 rounded-lg shadow-lg overflow-hidden">
      <TableHeader<UserData>
        title="User Management"
        onSearch={onSearch}
        addButtonText="Add User"
        renderModal={({ isOpen, onClose }) => (
          <UserModal
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={onAddUser}
            mode="add"
          />
        )}
      />

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y transition-bg dark:divide-gray-800 transition-component divide-gray-400">
          <thead className="dark:bg-black-50 transition-bg bg-gray-100">
            <tr>
              {['ID', 'Wallet Address', 'Role', 'Name', 'WhatsApp'].map((head) => (
                <th key={head} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center cursor-pointer hover:text-gray-700">
                    {head}
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </th>
              ))}
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="dark:bg-neutral-800 transition-bg bg-slate-100 divide-y transition-component dark:divide-gray-800 divide-gray-200">
            {filteredData.map(user => (
              <tr key={user.id} className="dark:hover:bg-neutral-700 hover:bg-slate-200 transition-bg">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium dark:text-white-50 text-gray-900">#{user.id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <WalletAddress address={user.wallet_address} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <RoleBadge roleId={user.role_id} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium dark:text-white-50 text-gray-900">{user.nama}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium dark:text-white-50 text-gray-900">{user.no_wa}</div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button onClick={() => handleEditUser(user)}
                    className="group relative p-2 font-medium text-white rounded-lg bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-500 hover:to-blue-700 transition-all duration-300 ease-out shadow-md hover:shadow-lg overflow-hidden">
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay"></span>
                    <div className="flex items-center justify-center gap-1 relative z-10">
                      <RiPencilLine className="text-white" />
                      <span>Edit</span>
                    </div>
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user)}
                    className="group relative p-2 font-medium text-white rounded-lg bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 transition-all duration-300 ease-out shadow-md hover:shadow-lg overflow-hidden">
                    <span className="absolute inset-0 bg-gradient-to-r from-rose-600 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay"></span>
                    <div className="flex items-center justify-center gap-1 relative z-10">
                      <FaTrashAlt className="text-red-100" />
                      <span>Hapus</span>
                    </div>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Ini Modal */}
        <UserModal
          isOpen={isModalOpen}
          userData={currentUser}
          onClose={handleCloseModal}
          mode="edit"
          onSubmit={handlerSubmit}
        />

        {/* Ini adalah modal delete */}
        {selectedUserId && (
          <ConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={confirmDeleteUser}
            userId={selectedUserId}
            isLoading={deleting}
            title="Konfirmasi Hapus"
            description="Apakah Anda yakin ingin menghapus pengguna ini?"
            confirmText={deleting ? "Menghapus..." : "Ya, Hapus"}
            cancelText="Batal"
          />
        )}


        {filteredData.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No users found</p>
          </div>
        )}
      </div>

      <div className="dark:bg-black-50 bg-gray-100 border-gray-400 px-6 py-4 border-t transition-bg transition-component dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">{filteredData.length}</span> users
          </div>
          <div className="flex space-x-2">
            <UiButton click={() => { }} icon={FaAngleLeft} />
            <UiButton click={() => { }} icon={FaAngleRight} />
          </div>
        </div>
      </div>
      <SuccessAlert />
    </div>
  );
};

export default ModernTableUI;
