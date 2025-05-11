'use client';
import FooterSection from "@/components/Section/FooterSection";
import HeaderSection from "@/components/Section/HeaderSection";
import HotelCard from "@/components/HotelCard";
import { IoBed, IoFastFood, IoFileTrayStacked, IoLocationOutline, IoStar } from "react-icons/io5";
import MySearchHeader from '@/components/MySearchHeader';
import Link from "next/link";
import NavbarPages from '@/components/NavbarPages';
import { useParams } from "next/navigation";
import TestiomonialSection from '@/components/Section/TestiomonialSection';

const DetailHotel = () => {
    const params = useParams();

    const topHotels = [
        {
            id: 1,
            nama_kamar: "Kamar Luxury Rusian",
            image: "image/misi.jpeg",
        },
        {
            id: 2,
            nama_kamar: "Kamar Luxury Rusian",
            image: "image/misi.jpeg",
        },
        {
            id: 3,
            nama_kamar: "Kamar Luxury Rusian",
            image: "image/misi.jpeg",
        },
        {
            id: 4,
            nama_kamar: "Kamar Luxury Rusian",
            image: "image/misi.jpeg",
        },
        {
            id: 5,
            nama_kamar: "Kamar Luxury Rusian",
            image: "image/misi.jpeg",
        },
        {
            id: 6,
            nama_kamar: "Kamar Luxury Rusian",
            image: "image/misi.jpeg",
        },
        {
            id: 7,
            nama_kamar: "Kamar Luxury Rusian",
            image: "image/misi.jpeg",
        },
        {
            id: 8,
            nama_kamar: "Kamar Luxury Rusian",
            image: "image/misi.jpeg",
        },
        {
            id: 9,
            nama_kamar: "Kamar Luxury Rusian",
            image: "image/misi.jpeg",
        },
        {
            id: 10,
            nama_kamar: "Kamar Luxury Rusian",
            image: "image/misi.jpeg",
        },
        {
            id: 11,
            nama_kamar: "Kamar Luxury Rusian",
            image: "image/misi.jpeg",
        },
        {
            id: 12,
            nama_kamar: "Kamar Luxury Rusian",
            image: "image/misi.jpeg",
        },
    ]

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(params.id);
        console.log(e.target.value)
    }

  return (
    <>
        <NavbarPages isHeaderSection/>
        <section className="w-full">
            <HeaderSection>
                <h1 className="md:text-3xl text-gray-300 text-center mb-2 font-bold text-xl">List Kamar Di Hotel HGI Indonesia</h1>
                <div className="md:text-lg text-gray-300 text-[15px] text-center flex gap-3 flex-col md:flex-row">
                    <p className="flex text-gray-300 items-center gap-1"><IoLocationOutline/> Jakarta, Pik, Jln Gajah Mada No.12</p>
                    <p className="flex text-gray-300 items-center gap-1"><IoBed/> 12 Kamar</p>
                    <p className="flex text-gray-300 items-center gap-1"><IoStar/> 4,5</p>
                </div>
                <MySearchHeader onChange={handleSearch} placeholder="Cari Nama Kamar Atau Kategori..."/>
            </HeaderSection>

            <div className="section-padding mt-20">
                <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 md:gap-x-5">
                    {topHotels.map((hotel, i) => (
                        <HotelCard key={i} data={{image: "/" + hotel.image,nama: hotel.nama_kamar, url: "/kamar/" + hotel.id}} index={i}>
                            <p className="text-gray-700 dark:text-gray-400 text-[15px] mt-1 flex items-center gap-1"><Link href="/" className="flex justify-center items-center gap-1 hover:text-blue-500 transition"><IoFileTrayStacked/>Kamar Luxury</Link></p>
                            <p className="text-gray-700 dark:text-gray-400 text-[15px] mt-1 flex items-center gap-1 mb-4"><IoFastFood/> 12 Fitur Didalamnya</p>
                        </HotelCard>
                    ))}
                </div>
            </div>
        </section>
        <TestiomonialSection title="Testimonial Hotel" sub="Testimonial Hotel HGI Indonesia"/>
        <FooterSection/>
    </>
  )
}

export default DetailHotel
