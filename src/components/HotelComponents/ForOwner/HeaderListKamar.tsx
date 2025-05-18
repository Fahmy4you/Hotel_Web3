'use client';
import { useState } from 'react';
import { HotelData } from '../../../../types/hotelData';
import { LuFilter } from "react-icons/lu";
import { useDebounce } from 'use-debounce';
import FilterModals from '@/components/Modals/Kamar/FilterModals';
import AddKamarModals from '@/components/Modals/Kamar/AddKamarModals';
import InputUI from '@/components/AtomsComponent/InputUI';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../libs/store';
import { openModals, closeModals } from '../../../../libs/slices/modalSlice';
import ListKamar from './ListKamar';

export default function HotelRoomFilterPage() {
  const dispatch = useDispatch();
  const modalState = useSelector((state: RootState) => state.modals);
  
  const [selectedHotel, setSelectedHotel] = useState<HotelData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debounce] = useDebounce(searchTerm, 500);
  
  const handleHotelSelect = (hotel: HotelData | null) => {
    setSelectedHotel(hotel);
  };

  
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };
  
  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">
          Daftar Kamar {selectedHotel?.nama_hotel}
        </h1>
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
            <InputUI
              type="text"
              placeholder="Cari kamar..."
               value={searchTerm} 
                onValueChange={handleSearchChange}
              icon={FaMagnifyingGlass}
              className="w-full md:w-64"
            />
          <div className="flex gap-2">
            <button
              onClick={() => dispatch(openModals('add'))}
              className="bg-neutral-900 text-white px-4 py-2 rounded-md shadow-lg transition-all duration-300
              hover:bg-neutral-800 text-sm font-semibold flex-grow sm:flex-grow-0
              dark:bg-white dark:hover:bg-neutral-300 dark:text-black border dark:border-gray-800"
            >
              Tambah Kamar
            </button>
            <button
              onClick={() => dispatch(openModals('filter'))}
              className="bg-white text-neutral-900 border border-neutral-300 px-4 py-2 rounded-md shadow-sm
              transition-all duration-300 hover:bg-gray-100 flex items-center justify-center gap-2 text-sm
              dark:bg-neutral-800 dark:text-white dark:border-neutral-700 dark:hover:bg-neutral-700"
            >
              <LuFilter className="text-lg" />
              <span className="hidden sm:inline">Filter</span>
            </button>
          </div>
        </div>
      </div>
      <div className="w-full">
        <ListKamar searchQuery={debounce}/>
      </div>
      <FilterModals
        isOpen={modalState.filter}
        onClose={() => dispatch(closeModals('filter'))}
        onSelectHotel={handleHotelSelect}
      />
      <AddKamarModals
        isOpen={modalState.add}
        onClose={() => dispatch(closeModals('add'))}
      />
    </div>
  );
}