"use client"
import FooterSection from "@/components/Section/FooterSection";
import HeaderSection from "@/components/Section/HeaderSection";
import HotelCard from "@/components/Card/HotelCard";
import { IoLocationOutline, IoBed } from "react-icons/io5";
import MySearchHeader from '@/components/MySearchHeader';
import NavbarPages from '@/components/NavbarPages';

const ListHotel = () => {
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

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value)
    }

  return (
    <>
        <NavbarPages isHeaderSection/>
        <section className="w-full">
            <HeaderSection>
                <h1 className="md:text-3xl text-gray-300 text-center mb-2 font-bold text-xl">List Hotel Yang Terdaftar</h1>
                <p className="md:text-lg text-gray-300 text-[15px] text-center">Ini Adalah List Hotel Yang Terdaftar Di Platform Kami</p>
                <MySearchHeader onChange={handleSearch}/>
            </HeaderSection>

            <div className="section-padding mt-20">
                <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 md:gap-x-5">
                    {topHotels.map((hotel, i) => (
                        <HotelCard key={i} data={{image: hotel.image,nama: hotel.nama_hotel, bintang:  hotel.bintang, url: "/hotel/" + hotel.id, buttonText: "Lihat Kamar"}} index={i}>
                            <p className="text-gray-700 dark:text-gray-400 text-[15px] mt-1 flex items-center gap-1"><IoLocationOutline/> {hotel.lokasi}</p>
                            <p className="text-gray-700 dark:text-gray-400 text-[15px] mt-1 flex items-center gap-1"><IoBed/> 12 Kamar</p>
                        </HotelCard>
                    ))}
                </div>
            </div>
        </section>
        <FooterSection/>
    </>
  )
}

export default ListHotel
