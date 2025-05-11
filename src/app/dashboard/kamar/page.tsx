import CarrouselUI from '@/components/CarrouselUI'
import HeaderListKamar from '@/components/HotelComponents/ForOwner/HeaderListKamar'
import ListKamar from '@/components/HotelComponents/ForOwner/ListKamar'
import React from 'react'

const page = () => {
  return (
    <div className='flex flex-col gap-4'>
        <HeaderListKamar/>
        <ListKamar/>
        <CarrouselUI/>
    </div>
  )
}

export default page