import TitleHeader from "@/components/TitleHeader"
import HotelCard from "@/components/Card/HotelCard"
import { IoLocationOutline, IoBed } from "react-icons/io5"
import Link from "next/link"

const TopHotelSection = () => {
    const topHotels = [
        {
            id: 1,
            nama_hotel: "Hotel Indonesia Group",
            image: "image/misi.jpeg",
            lokasi: "Jakarta, Pik, Jln Gajah Mada No.12",
            bintang: 5
        },
        {
            id: 2,
            nama_hotel: "Hotel Indonesia Group",
            image: "image/misi.jpeg",
            lokasi: "Jakarta, Pik, Jln Gajah Mada No.12",
            bintang: 5
        },
        {
            id: 3,
            nama_hotel: "Hotel Indonesia Group",
            image: "image/misi.jpeg",
            lokasi: "Jakarta, Pik, Jln Gajah Mada No.12",
            bintang: 5
        },
        {
            id: 4,
            nama_hotel: "Hotel Indonesia Group",
            image: "image/misi.jpeg",
            lokasi: "Jakarta, Pik, Jln Gajah Mada No.12",
            bintang: 5
        },
        {
            id: 5,
            nama_hotel: "Hotel Indonesia Group",
            image: "image/misi.jpeg",
            lokasi: "Jakarta, Pik, Jln Gajah Mada No.12",
            bintang: 5
        },
        {
            id: 6,
            nama_hotel: "Hotel Indonesia Group",
            image: "image/misi.jpeg",
            lokasi: "Jakarta, Pik, Jln Gajah Mada No.12",
            bintang: 5
        },
        {
            id: 7,
            nama_hotel: "Hotel Indonesia Group",
            image: "image/misi.jpeg",
            lokasi: "Jakarta, Pik, Jln Gajah Mada No.12",
            bintang: 5
        },
        {
            id: 8,
            nama_hotel: "Hotel Indonesia Group",
            image: "image/misi.jpeg",
            lokasi: "Jakarta, Pik, Jln Gajah Mada No.12",
            bintang: 5
        },
        {
            id: 9,
            nama_hotel: "Hotel Indonesia Group",
            image: "image/misi.jpeg",
            lokasi: "Jakarta, Pik, Jln Gajah Mada No.12",
            bintang: 5
        },
        {
            id: 10,
            nama_hotel: "Hotel Indonesia Group",
            image: "image/misi.jpeg",
            lokasi: "Jakarta, Pik, Jln Gajah Mada No.12",
            bintang: 5
        },
        {
            id: 11,
            nama_hotel: "Hotel Indonesia Group",
            image: "image/misi.jpeg",
            lokasi: "Jakarta, Pik, Jln Gajah Mada No.12",
            bintang: 5
        },
        {
            id: 12,
            nama_hotel: "Hotel Indonesia Group",
            image: "image/misi.jpeg",
            lokasi: "Jakarta, Pik, Jln Gajah Mada No.12",
            bintang: 5
        },
    ]

  return (
    <section id="tophotel" className="section-padding pt-5 md:pt-10 w-full">
        <TitleHeader title='12 Hotel Rating Terbaik' sub='12 Hotel Rekomendasi Untuk Anda🏩'/>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 md:gap-x-5 mt-16">
            {topHotels.map((hotel, i) => (
                <HotelCard key={i} data={{image: hotel.image,nama: hotel.nama_hotel, bintang:  hotel.bintang, url: "/hotel/" + hotel.id}} index={i}>
                    <p className="text-gray-800 dark:text-gray-400 text-[15px] mt-1 flex items-center gap-1"><IoLocationOutline/> {hotel.lokasi}</p>
                    <p className="text-gray-800 dark:text-gray-400 text-[15px] mt-1 flex items-center gap-1"><IoBed/> 12 Kamar</p>
                </HotelCard>
            ))}
        </div>
        <div className="mt-10 flex justify-center items-center">
            <Link href="/hotel" className="border-1 mb-3 flex justify-center items-center rounded hover:bg-gray-500 dark:hover:bg-white-50 bg-transparent hover:text-white-50 dark:hover:text-black-50 transition border-gray-500 dark:border-white-50 py-2 px-4 contact-btn group">
                <span>Cek Lebih Banyak Hotel Lainnya</span>
            </Link>
        </div>
    </section>
  )
}

export default TopHotelSection
