"use client"
import TitleHeader from "@/components/TitleHeader"
import HotelCard from "@/components/HotelCard"
import { IoLocationOutline, IoBed } from "react-icons/io5"
import Link from "next/link"
import { useState, useEffect } from "react"
import { getHotelTop } from "@/app/Server/Hotel/Data/data"
import { potongText } from "@/utils/Helper"
import { Spinner } from "@heroui/react"

const TopHotelSection = () => {

    const [loading, setLoading] = useState(false);
    const [topHotels, setTopHotels] = useState<Awaited<ReturnType<typeof getHotelTop>> | []>([])

    async function getTopHotels() {
        setLoading(true)
        const getHotels = await getHotelTop();
        setTopHotels(getHotels);
        setLoading(false)
    }
    
    useEffect(() => {
        getTopHotels();
    }, [])

  return (
    <section id="tophotel" className="section-padding pt-5 md:pt-10 w-full">
        <TitleHeader title='12 Hotel Rating Terbaik' sub='12 Hotel Rekomendasi Untuk Anda🏩'/>

        {!loading ? (
            topHotels.length != 0 ? (
                <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 md:gap-x-5 mt-16">
                    {topHotels.map((hotel, i) => (
                        <HotelCard key={i} data={{image: hotel.images && hotel.images[0] as string,nama: hotel.nama_hotel, bintang:  hotel.rating, url: "/hotel/" + hotel.id}} index={i}>
                            <p className="text-gray-800 dark:text-gray-400 text-[15px] mt-1 flex items-center gap-1"><IoLocationOutline/> {potongText(hotel.lokasi, 30)}</p>
                            <p className="text-gray-800 dark:text-gray-400 text-[15px] mt-1 flex items-center gap-1"><IoBed/> {hotel.total_kamar} Kamar</p>
                        </HotelCard>
                    ))}
                </div>
            ) : (
                <div className="mt-16 flex justify-center text-2xl font-bold">Tidak Ada Data Hotel</div>
            )
        ) : (
            <div className="mt-16 flex justify-center text-lg font-bold items-center gap-3"><Spinner color="primary" classNames={{dots: ['bg-gray-900', 'dark:bg-white-50']}} variant="wave" label="Memuat Data..."/></div>
        )}
        <div className="mt-10 flex justify-center items-center">
            <Link href="/hotel" className="border-1 mb-3 flex justify-center items-center rounded hover:bg-gray-500 dark:hover:bg-white-50 bg-transparent hover:text-white-50 dark:hover:text-black-50 transition border-gray-500 dark:border-white-50 py-2 px-4 contact-btn group">
                <span>Cek Lebih Banyak Hotel Lainnya</span>
            </Link>
        </div>
    </section>
  )
}

export default TopHotelSection
