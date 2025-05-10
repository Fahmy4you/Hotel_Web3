'use client';
import { useState } from 'react';
import { HotelData } from '../../../../types/hotelData';
import { Filter, X, CheckCircle } from 'lucide-react';
import FilterModals from '../FilterModals';
import { IoClose } from 'react-icons/io5';

export default function HotelRoomFilterPage() {
   const [selectedHotel, setSelectedHotel] = useState<HotelData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHotelId, setSelectedHotelId] = useState(null);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

   const handleHotelSelect = (hotel: HotelData | null) => {
    setSelectedHotel(hotel);
    console.log("Hotel terpilih:", hotel);
  };

  const applyFilter = () => {
    closeModal();
    console.log("Filtering by hotel ID:", selectedHotelId);
  };

  return (
    <div className="p-4">
      {/* Header dan tombol Filter */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Daftar Kamar {selectedHotel?.nama_hotel}</h1>
        <div className="flex space-x-2">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
            Tambah Kamar
          </button>
          <button 
            className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-md flex items-center"
            onClick={openModal}
          >
            {selectedHotel ?
             <div className='flex gap-1 justify-center items-center'>
              <IoClose className="h-5 w-5 mr-1" />
              <span className="">Clear Filter</span>
            </div> :  
            <div className='flex gap-1 justify-center items-center'>
              <Filter className="h-5 w-5 mr-1" />
              <span className="">Filter</span>
            </div>}
          </button>
        </div>
      </div>

      <FilterModals isOpen={isModalOpen} onClose={closeModal} onSelectHotel={handleHotelSelect} onAction={applyFilter} />
    </div>
  );
}