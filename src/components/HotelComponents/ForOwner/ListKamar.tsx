'use client'
import React, { useEffect } from 'react'
import HotelRoomCard from '../../Card/CardKamar'
import { useManageKamar } from '@/hooks/useManageKamar'
import { useSelector } from 'react-redux'
import { RootState } from '../../../../libs/store'
import { Skeleton } from '@heroui/react'

interface ListKamarProps {
  searchQuery: string;
}

const ListKamar: React.FC<ListKamarProps> = ({ searchQuery }) => {
  const userId = useSelector((state: RootState) => state.users.id) || 0;
  const { kamars, isLoading, fetchKamars, setQuery } = useManageKamar(userId);
  useEffect(() => {
    setQuery(searchQuery);
  }, [searchQuery, setQuery]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(10)].map((_, index) => (
          <Skeleton key={index} className="rounded-lg w-full">
            <div className="h-[175px] rounded-lg bg-default-300"></div>
          </Skeleton>
        ))}
      </div>
    );
  }

  if (kamars.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Tidak ada kamar tersedia</p>
        <button 
          onClick={fetchKamars}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Coba Muat Ulang
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {kamars.map((kamar) => (
        <HotelRoomCard 
          key={kamar.id} 
          kamar={kamar} 
        />
      ))}
    </div>
  );
}

export default ListKamar;