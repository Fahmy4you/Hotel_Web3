'use client';
import React, { useState } from 'react';
import { FaTrashAlt } from "react-icons/fa";
import { RiPencilLine } from "react-icons/ri";
import { ArrowUpDown } from 'lucide-react';
import TableHeader from '@/components/TableAtom/TableHeader';
import TableFooter from '@/components/TableAtom/TableFooter';
import { HotelData } from '../../../../types/hotelData';
import HotelModal from '@/components/Modals/Hotel/HotelModal';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../libs/store';
import { useManageHotel } from '@/hooks/useManageHotel';
import ConfirmDeleteHotelModal from '@/components/Modals/Hotel/ModalConfrimDelete';

interface TableHotelProps {
  onEditHotel?: (hotelData: HotelData) => void;
  onAddHotel?: (hotelData: HotelData) => void;
}

const TableHotel: React.FC<TableHotelProps> = ({ onEditHotel, onAddHotel }) => {
  const userID = useSelector((state: RootState) => state.users.id) || 0;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentHotel, setCurrentHotel] = useState<HotelData | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedHotelId, setSelectedHotelId] = useState<number | null>(null);

  const {
    hotels,
    setQuery,
    query,
    deleting,
    submitHotel,
    deleteMyHotel
  } = useManageHotel(userID, onEditHotel, onAddHotel);

  const filteredData = hotels.filter(hotel =>
    (hotel.nama_hotel || '').toLowerCase().includes(query.toLowerCase())
  );

  const handleAddNewHotel = (formData: HotelData) => {
    submitHotel(formData, isEditMode, currentHotel, handleCloseModal);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentHotel(null);
    setIsEditMode(false);
  };

  const handleOpenAddModal = () => {
    setIsEditMode(false);
    setCurrentHotel(null);
    setIsModalOpen(true);
  };

  const handleEditHotel = (hotel: HotelData) => {
    setIsEditMode(true);
    setCurrentHotel(hotel);
    setIsModalOpen(true);
  };

  const handleDeleteHotel = (hotel: HotelData) => {
    if (hotel.id === undefined) return;
    setSelectedHotelId(hotel.id);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteHotel = async () => {
    if (selectedHotelId === null) return;
    await deleteMyHotel(selectedHotelId);
    setIsDeleteModalOpen(false);
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'nama_hotel', label: 'Nama Hotel' },
    { key: 'desk', label: 'Deskripsi' },
    { key: 'lokasi', label: 'Lokasi' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: 'Actions', align: 'right' }
  ];

  return (
    <div className="w-full dark:bg-black-50 bg-gray-100 rounded-lg shadow-lg overflow-hidden transition-colors">
      <TableHeader<HotelData>
        title="Hotel Management"
        onSearch={setQuery}
        addButtonText="Tambah"
        onAddButtonClick={handleOpenAddModal}
        renderModal={() => (
          <HotelModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSubmit={handleAddNewHotel}
            mode={isEditMode ? 'edit' : 'add'}
            hotelData={currentHotel}
          />
        )}
      />

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-400 dark:divide-gray-800 transition-colors">
          <thead className="bg-gray-100 dark:bg-black-50 transition-colors">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.align === 'right' ? 'text-right' : ''}`}
                >
                  <div className={`flex items-center ${column.align !== 'right' ? 'cursor-pointer hover:text-gray-700' : ''}`}>
                    {column.label}
                    {column.align !== 'right' && <ArrowUpDown className="ml-1 h-4 w-4" />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-slate-100 dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-gray-800 transition-colors">
            {filteredData.map(hotel => (
              <tr key={hotel.id} className="hover:bg-slate-200 dark:hover:bg-neutral-700 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white-50">#{hotel.id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white-50">{hotel.nama_hotel}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white-50">{hotel.desk}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white-50">{hotel.lokasi}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${hotel.is_banned ? 'bg-red-900/20 text-red-500 border border-red-500 shadow-[0_0_4px_rgba(239,68,68,0.5)]' : 'bg-green-900/20 text-green-400 border border-green-400 shadow-[0_0_4px_rgba(74,222,128,0.5)]'}`}>
                    <span className={`w-2 h-2 rounded-full mr-1.5 ${hotel.is_banned ? 'bg-red-500 animate-pulse' : 'bg-green-400 animate-pulse'}`}></span>
                    {hotel.is_banned ? 'Inactive' : 'Active'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                  <button
                    onClick={() => handleEditHotel(hotel)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-yellow-500 bg-yellow-900/10 border border-yellow-500/50 hover:bg-yellow-900/20 hover:shadow-[0_0_5px_rgba(234,179,8,0.5)] transition-all duration-200 text-xs"
                  >
                    <RiPencilLine className="text-xs" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteHotel(hotel)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-red-500 bg-red-900/10 border border-red-500/50 hover:bg-red-900/20 hover:shadow-[0_0_5px_rgba(239,68,68,0.5)] transition-all duration-200 text-xs"
                  >
                    <FaTrashAlt className="text-xs" />
                    <span>Delete</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredData.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No hotels found</p>
          </div>
        )}
      </div>

      <TableFooter
        itemCount={filteredData.length}
        itemName="hotels"
        onPrev={() => { }}
        onNext={() => { }}
      />

      <ConfirmDeleteHotelModal
        hotelId={selectedHotelId || 0}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteHotel}
        isLoading={deleting}
      />
    </div>
  );
};

export default TableHotel;
