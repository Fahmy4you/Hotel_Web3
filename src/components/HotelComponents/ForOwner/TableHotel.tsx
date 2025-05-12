'use client';
import React from 'react';
import { FaTrashAlt } from "react-icons/fa";
import { RiPencilLine } from "react-icons/ri";
import TableHeader from '@/components/TableAtom/TableHeader';
import TableFooter from '@/components/TableAtom/TableFooter';
import { HotelData } from '../../../../types/hotelData';
import HotelModal from '@/components/Modals/Hotel/HotelModal';
import { useDispatch, useSelector } from 'react-redux';
import GenericRow from '@/components/TableAtom/GenericRow';
import { RootState } from '../../../../libs/store';
import { useManageHotel } from '@/hooks/useManageHotel';
import ConfirmDeleteHotelModal from '@/components/Modals/Hotel/ModalConfrimDelete';
import WrapperTable from '@/components/root/WrapperTable';
import BadgeUI from '@/components/AtomsComponent/BadgeUI';
import { addToast } from '@heroui/react';
import { openModals, closeModals } from '../../../../libs/slices/modalSlice';

const TableHotel = () => {
  const dispatch = useDispatch();
  const userID = useSelector((state: RootState) => state.users.id) || 0;
  const modalsState = useSelector((state: RootState) => state.modals);
  
  const [currentHotel, setCurrentHotel] = React.useState<HotelData | null>(null);
  const [selectedHotelId, setSelectedHotelId] = React.useState<number | null>(null);
  const [formErrors, setFormErrors] = React.useState<Record<string, string[]>>({});

  const {
    hotels,
    query,
    deleting,
    setQuery,
    submitHotel,
    deleteMyHotel,
  } = useManageHotel(userID);

  const filteredData = hotels.filter(hotel =>
    hotel.nama_hotel.toLowerCase().includes(query.toLowerCase())
  );

  const handleSubmitHotel = async (formData: HotelData) => {
    const isEditMode = Boolean(currentHotel);
    const errors = await submitHotel(formData, isEditMode, currentHotel, handleCloseModal);

    if (errors) {
      setFormErrors(errors);
      addToast({
        title: 'Error',
        description: Object.values(errors).flat().join(', '),
        variant: 'flat',
        color: 'danger',
      });
      return;
    }
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setCurrentHotel(null);
    setFormErrors({});
    dispatch(closeModals('add'));
    dispatch(closeModals('delete'));
  };

  const handleOpenAddModal = () => {
    setCurrentHotel(null);
    dispatch(openModals('add'));
  };

  const handleEditHotel = (hotel: HotelData) => {
    setCurrentHotel(hotel);
    dispatch(openModals('add'));
  };

  const handleDeleteHotel = (hotel: HotelData) => {
    if (hotel.id) {
      setSelectedHotelId(hotel.id);
      dispatch(openModals('delete'));
    }
  };

  const confirmDeleteHotel = async () => {
    if (selectedHotelId) {
      await deleteMyHotel(selectedHotelId);
      handleCloseModal();
    }
  };

  const columns = ['id', 'nama_hotel', 'lokasi', 'isBaned'];
  const customRender = {
    isBaned: (value: boolean) => (
      <BadgeUI variant={value ? 'error' : 'success'}>
        {value ? 'Inactive' : 'Active'}
      </BadgeUI>
    )
  };

  return (
    <WrapperTable>
      <TableHeader
        placeholder="Cari Hotel..."
        title="Hotel Management"
        onSearch={setQuery}
        addButtonText="Tambah"
        onAddButtonClick={handleOpenAddModal}
      />

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-400 dark:divide-gray-800">
          <thead className="bg-gray-100 dark:bg-black-50">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {column === 'nama_hotel' ? 'Nama Hotel' : 
                   column === 'lokasi' ? 'Lokasi' : 
                   column === 'isBaned' ? 'Status' : column}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-slate-100 dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-gray-800">
            {filteredData.map(hotel => (
              <GenericRow
                key={hotel.id}
                data={hotel}
                columns={columns}
                customRender={customRender}
                actions={
                  <div className='space-x-2'>
                    <button 
                      className='inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-yellow-500 bg-yellow-900/10 border border-yellow-500/50 hover:bg-yellow-900/20 hover:shadow-[0_0_5px_rgba(234,179,8,0.5)] transition-all duration-200 text-xs'
                      onClick={() => handleEditHotel(hotel)}
                    >
                      Edit <RiPencilLine className="h-5 w-5" />
                    </button>
                    <button
                      className='inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-red-500 bg-red-900/10 border border-red-500/50 hover:bg-red-900/20 hover:shadow-[0_0_5px_rgba(239,68,68,0.5)] transition-all duration-200 text-xs'
                      onClick={() => handleDeleteHotel(hotel)}
                    >
                      Hapus <FaTrashAlt className="h-5 w-5" />
                    </button>
                  </div>
                }
              />
            ))}
          </tbody>
        </table>

        {!filteredData.length && (
          <div className="text-center py-8">
            <p className="text-gray-500">No hotels found</p>
          </div>
        )}
      </div>

      <TableFooter onPrev={() => {}} onNext={() => {}} itemCount={filteredData.length} itemName="hotels" />

      <ConfirmDeleteHotelModal
        hotelId={selectedHotelId || 0}
        isOpen={modalsState.delete}
        onClose={handleCloseModal}
        onConfirm={confirmDeleteHotel}
        isLoading={deleting}
      />
      
      <HotelModal
        isOpen={modalsState.add}
        onClose={handleCloseModal}
        onSubmit={handleSubmitHotel}
        mode={currentHotel ? 'edit' : 'add'}
        hotelData={currentHotel}
        errors={formErrors}
      />
    </WrapperTable>
  );
};

export default TableHotel;