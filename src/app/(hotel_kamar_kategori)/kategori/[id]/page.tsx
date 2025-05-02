'use client';
import FooterSection from "@/components/FooterSection";
import HeaderSection from "@/components/HeaderSection";
import HotelCard from "@/components/HotelCard";
import { IoHomeOutline, IoFastFood, IoFileTrayStacked, IoLocationOutline, IoStar } from "react-icons/io5";
import MySearchHeader from '@/components/MySearchHeader';
import Link from "next/link";
import NavbarPages from '@/components/NavbarPages';
import { useParams } from "next/navigation";

const DetailHotel = () => {
    const params = useParams();

    const topHotels = [
        {
            id: 1,
            nama_hotel: "Hotel Indonesia Group",
            nama_kamar: "Kamar Luxury Rusian",
            image: "image/misi.jpeg",
            lokasi: "Jakarta, Pik, Jln Gajah Mada No.12",
        },
        {
            id: 2,
            nama_hotel: "Hotel Indonesia Group",
            nama_kamar: "Kamar Luxury Rusian",
            image: "image/misi.jpeg",
            lokasi: "Jakarta, Pik, Jln Gajah Mada No.12",
        },
        {
            id: 3,
            nama_hotel: "Hotel Indonesia Group",
            nama_kamar: "Kamar Luxury Rusian",
            image: "image/misi.jpeg",
            lokasi: "Jakarta, Pik, Jln Gajah Mada No.12",
        },
        {
            id: 4,
            nama_hotel: "Hotel Indonesia Group",
            nama_kamar: "Kamar Luxury Rusian",
            image: "image/misi.jpeg",
            lokasi: "Jakarta, Pik, Jln Gajah Mada No.12",
        },
        {
            id: 5,
            nama_hotel: "Hotel Indonesia Group",
            nama_kamar: "Kamar Luxury Rusian",
            image: "image/misi.jpeg",
            lokasi: "Jakarta, Pik, Jln Gajah Mada No.12",
        },
        {
            id: 6,
            nama_hotel: "Hotel Indonesia Group",
            nama_kamar: "Kamar Luxury Rusian",
            image: "image/misi.jpeg",
            lokasi: "Jakarta, Pik, Jln Gajah Mada No.12",
        },
        {
            id: 7,
            nama_hotel: "Hotel Indonesia Group",
            nama_kamar: "Kamar Luxury Rusian",
            image: "image/misi.jpeg",
            lokasi: "Jakarta, Pik, Jln Gajah Mada No.12",
        },
        {
            id: 8,
            nama_hotel: "Hotel Indonesia Group",
            nama_kamar: "Kamar Luxury Rusian",
            image: "image/misi.jpeg",
            lokasi: "Jakarta, Pik, Jln Gajah Mada No.12",
        },
        {
            id: 9,
            nama_hotel: "Hotel Indonesia Group",
            nama_kamar: "Kamar Luxury Rusian",
            image: "image/misi.jpeg",
            lokasi: "Jakarta, Pik, Jln Gajah Mada No.12",
        },
        {
            id: 10,
            nama_hotel: "Hotel Indonesia Group",
            nama_kamar: "Kamar Luxury Rusian",
            image: "image/misi.jpeg",
            lokasi: "Jakarta, Pik, Jln Gajah Mada No.12",
        },
        {
            id: 11,
            nama_hotel: "Hotel Indonesia Group",
            nama_kamar: "Kamar Luxury Rusian",
            image: "image/misi.jpeg",
            lokasi: "Jakarta, Pik, Jln Gajah Mada No.12",
        },
        {
            id: 12,
            nama_hotel: "Hotel Indonesia Group",
            nama_kamar: "Kamar Luxury Rusian",
            image: "image/misi.jpeg",
            lokasi: "Jakarta, Pik, Jln Gajah Mada No.12",
        },
    ]

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(params.id);
        console.log(e.target.value)
    }

  return (
    <>
        <NavbarPages/>
        <section className="w-full pt-20">
            <HeaderSection>
                <h1 className="md:text-3xl text-center mb-2 font-bold text-xl">List Kamar Di Kategori Room Luxury</h1>
                <p className="md:text-lg text-[15px] text-center">Ini Adalah List Hotel Yang Terdaftar Di Kategori Room Luxury</p>
                <MySearchHeader onChange={handleSearch} placeholder="Cari Nama Hotel, Nama Kamar Atau Alamat Hotel..."/>
            </HeaderSection>

            <div className="section-padding mt-20">
                <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 md:gap-x-5">
                    {topHotels.map((hotel, i) => (
                        <HotelCard key={i} data={{image: "/" + hotel.image,nama: hotel.nama_kamar, url: "/kamar/" + hotel.id}} index={i}>
                            <p className="text-gray-400 text-[15px] mt-1 flex items-center gap-1"><Link href="/" className="flex justify-center items-center gap-1 hover:text-blue-500 transition"><IoHomeOutline/> {hotel.nama_hotel}</Link></p>
                            <p className="text-gray-400 text-[15px] mt-1 flex items-center gap-1"><IoLocationOutline/> {hotel.lokasi}</p>
                            <p className="text-gray-400 text-[15px] mt-1 flex items-center gap-1"><IoFastFood/> 12 Fitur Didalamnya</p>
                        </HotelCard>
                    ))}
                </div>
            </div>
        </section>
        <FooterSection/>
    </>
  )
}

export default DetailHotel
