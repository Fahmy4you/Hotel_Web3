'use client'
import React, { useEffect } from 'react'
import HotelRoomCard from '../../Card/CardKamar'
import { useManageKamar } from '@/hooks/useManageKamar'
import { RotateCwIcon } from 'lucide-react'
import { Button, Skeleton } from '@heroui/react'
import { useHooksUser } from '@/hooks/useHooksUser'

interface ListKamarProps {
  searchQuery?: string;
  selectedHotel?: any;
}

const ListKamar: React.FC<ListKamarProps> = ({ searchQuery, selectedHotel }) => {
  const {user} = useHooksUser();
  const { kamars, isLoading, fetchKamars, setQuery } = useManageKamar(user?.id || 0);
  
  useEffect(() => {
    if (searchQuery) {
      setQuery(searchQuery);
    }
  }, [searchQuery, setQuery]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(9)].map((_, index) => (
          <Skeleton key={index} className="rounded-lg w-full">
            <div className="h-[450px] rounded-lg bg-default-300"></div>
          </Skeleton>
        ))}
      </div>
    );
  }

  if (kamars.length === 0) {
    return (
      <div className="text-center flex flex-col gap-3 justify-center items-center h-full py-8">
        <p className="text-gray-500 dark:text-gray-400 text-xl">Tidak ada kamar tersedia</p>
        <Button
          startContent={<RotateCwIcon />}
          onPress={fetchKamars}
          className="bg-neutral-900 text-white px-4 py-2 rounded-md shadow-lg transition-all duration-300
              hover:bg-neutral-800 text-sm font-semibold flex-grow sm:flex-grow-0
              dark:bg-white dark:hover:bg-neutral-300 dark:text-black border dark:border-gray-800"
        >
          Coba Muat Ulang
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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