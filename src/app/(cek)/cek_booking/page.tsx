'use client'
import NavbarPages from '@/components/NavbarPages';
import HeaderSection from '@/components/Section/HeaderSection';
import MySearchHeader from '@/components/MySearchHeader';
import debounce from 'lodash.debounce';
import { formatRupiah, potongText } from '@/utils/Helper';
import FooterSection from '@/components/Section/FooterSection';
import { FaPersonWalking, FaPersonWalkingWithCane, FaPersonWalkingLuggage } from 'react-icons/fa6';
import BadgeUI from '@/components/BadgeUI';
import { useMediaQuery } from 'react-responsive';
import { Tooltip } from '@heroui/react';


const CekBooking = () => {    
    const is600Px = useMediaQuery({ query: '(max-width: 600px)' });
    const isCutText2 = useMediaQuery({ query: '(max-width: 500px)' });
    const isCutText3 = useMediaQuery({ query: '(max-width: 380px)' });
    let status = 0;

    const cutTextDisplay = (text: string, is600 = true) => {
        if(isCutText3) {
            return potongText(text, 12)
        } else if(isCutText2) {
            return potongText(text, 20)
        } else if(is600Px && is600) {
            return potongText(text, 35)
        } else {
            return text
        }
    }

    const handleCopy = async (text: string) => {
        await navigator.clipboard.writeText(text)
    }


    const handleSearch = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value)
    }, 500)


  return (
    <>
        <NavbarPages isHeaderSection/>
        <section className="w-full">
            <HeaderSection>
                <h1 className="md:text-3xl text-gray-300 text-center mb-2 font-bold text-xl">Cek Bookingmu Di Semua Hotel</h1>
                <p className="md:text-lg text-gray-300 text-[15px] text-center">Cek Data Bookingmu Sesuai Transaksi ID Dan H-3 Checkin</p>
                <MySearchHeader onChange={handleSearch} placeholder="Cari Transaksi Berdasarkan ID Transaksi..."/>
            </HeaderSection>

            <div className="section-padding grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mx-10 py-8 mt-20 bg-gray-300 dark:bg-black-100 rounded-lg">
                <div className="flex gap-x-2">
                    
                </div>
            </div>
        </section>
        <FooterSection/>
    </>
  )
}

export default CekBooking
