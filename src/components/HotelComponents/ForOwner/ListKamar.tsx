'use client'
import React from 'react'
import HotelRoomCard from '../CardKamar'
import { useManageKamar } from '@/hooks/useManageKamar'
import { useSelector } from 'react-redux'
import { RootState } from '../../../../libs/store'

const ListKamar = () => {
  const userId = useSelector((state : RootState) => state.users.id) || 0;
  const {kamars} = useManageKamar(userId);
  return (
    <div>
      {kamars.length > 0 && kamars.map((kamar) => <HotelRoomCard key={kamar.id} kamar={kamar} />) || <p className='text-center'>Tidak ada kamar tersedia</p>}
    </div>
  )
}

export default ListKamar