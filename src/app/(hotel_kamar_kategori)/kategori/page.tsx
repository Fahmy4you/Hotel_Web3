'use client';
import FooterSection from "@/components/Section/FooterSection";
import HeaderSection from "@/components/Section/HeaderSection";
import HotelCard from "@/components/HotelCard";
import MySearchHeader from '@/components/MySearchHeader';
import NavbarPages from '@/components/NavbarPages';
import { useParams } from "next/navigation";
import { IoBed } from "react-icons/io5";

const DetailHotel = () => {
    const params = useParams();

    const kategoris = [
        {
            id: 1,
            kategori: "Kamar Luxury",
            jumlah_kamar: 12,
            image: "image/visi.jpeg",
        },
        {
            id: 2,
            kategori: "Kamar Luxury",
            jumlah_kamar: 12,
            image: "image/visi.jpeg",
        },
        {
            id: 3,
            kategori: "Kamar Luxury",
            jumlah_kamar: 12,
            image: "image/visi.jpeg",
        },
        {
            id: 4,
            kategori: "Kamar Luxury",
            jumlah_kamar: 12,
            image: "image/visi.jpeg",
        },
        {
            id: 5,
            kategori: "Kamar Luxury",
            jumlah_kamar: 12,
            image: "image/visi.jpeg",
        },
        {
            id: 6,
            kategori: "Kamar Luxury",
            jumlah_kamar: 12,
            image: "image/visi.jpeg",
        },
        {
            id: 7,
            kategori: "Kamar Luxury",
            jumlah_kamar: 12,
            image: "image/visi.jpeg",
        },
        {
            id: 8,
            kategori: "Kamar Luxury",
            jumlah_kamar: 12,
            image: "image/visi.jpeg",
        },
        {
            id: 9,
            kategori: "Kamar Luxury",
            jumlah_kamar: 12,
            image: "image/visi.jpeg",
        },
        {
            id: 10,
            kategori: "Kamar Luxury",
            jumlah_kamar: 12,
            image: "image/visi.jpeg",
        },
        {
            id: 11,
            kategori: "Kamar Luxury",
            jumlah_kamar: 12,
            image: "image/visi.jpeg",
        },
        {
            id: 12,
            kategori: "Kamar Luxury",
            jumlah_kamar: 12,
            image: "image/visi.jpeg",
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
                <h1 className="md:text-3xl text-gray-300 text-center mb-2 font-bold text-xl">List Kamar Di Kategori Room Luxury</h1>
                <p className="md:text-lg text-gray-300 text-[15px] text-center">Ini Adalah List Hotel Yang Terdaftar Di Kategori Room Luxury</p>
                <MySearchHeader onChange={handleSearch} placeholder="Cari Kategori..."/>
            </HeaderSection>

            <div className="section-padding mt-20">
                <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 md:gap-x-5">
                    {kategoris.map((kategori, i) => (
                        <HotelCard key={i} data={{image: "/" + kategori.image,nama: kategori.kategori, url: "/kategori/" + kategori.id, buttonText: "Lihat Kamar"}} index={i}>
                            <p className="dark:text-gray-400 text-gray-700 text-[15px] mt-1 flex items-center gap-1"><IoBed/> {kategori.jumlah_kamar} Kamar Didalamnya</p>
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
