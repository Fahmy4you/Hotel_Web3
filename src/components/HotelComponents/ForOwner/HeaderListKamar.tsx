'use client';
import { useState } from 'react';
import { HotelData } from '../../../../types/hotelData';
import { LuFilter } from "react-icons/lu";
import FilterModals from '../FilterModals';
import { IoClose } from 'react-icons/io5';
import InputUI from '@/components/InputUI';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../libs/store';
import { openModals, closeModals } from '../../../../libs/slices/modalSlice';

export default function HotelRoomFilterPage() {
  const dispatch = useDispatch();
  const modalState = useSelector((state : RootState) => state.modals); // State modals dengan redux

   const [selectedHotel, setSelectedHotel] = useState<HotelData | null>(null);
  const [query, setQuey] = useState(''); 
  const [selectedHotelId, setSelectedHotelId] = useState(null);
   const handleHotelSelect = (hotel: HotelData | null) => {
    setSelectedHotel(hotel);
    console.log("Hotel terpilih:", hotel);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl transition-color dark:text-white-50 text-black-50 font-bold">Daftar Kamar {selectedHotel?.nama_hotel}</h1>
        <div className="flex space-x-2">
          <InputUI type="text" value={query} onValueChange={setQuey} placeholder="Cari Kamar" icon={FaMagnifyingGlass}/>
  <button className="bg-neutral-900 text-sm cursor-pointer hover:bg-white-200 text-white px-4 rounded-md shadow-lg transition-all duration-300 
    dark:bg-white dark:hover:bg-neutral-300 font-semibold dark:text-black border dark:border-gray-800">
    Tambah Kamar
  </button>
  <button
    className="bg-neutral-900 cursor-pointer text-sm font-semibold text-white px-4 rounded-md flex items-center shadow-lg transition-all duration-300
    dark:bg-white dark:hover:bg-neutral-300 dark:text-black border border-neutral-300 dark:border-gray-800"
    onClick={() => dispatch(openModals('filter'))}
  >
    {selectedHotel ? 
      <div className='flex gap-1 justify-center items-center'>
        <IoClose className="h-5 w-5 mr-1" />
        <span className="">Clear Filter</span>
      </div> :
      <div className='flex gap-1 justify-center items-center'>
        <LuFilter className="h-5 w-5 mr-1" />
        <span className="">Filter</span>
      </div>}
  </button>
</div>
      </div>
        <FilterModals isOpen={modalState.filter} onClose={() => dispatch(closeModals('filter'))} onSelectHotel={handleHotelSelect} />
    </div>
  );
}