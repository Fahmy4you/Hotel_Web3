import HotelRoomFilterPage from '@/components/HotelComponents/ForOwner/HeaderListKamar'
import TableKamar from '@/components/HotelComponents/ForOwner/TableKamar'
import React from 'react'

const page = () => {
  return (
    <div className='flex flex-col gap-4'>
        <TableKamar/>
    </div>
  )
}

export default page