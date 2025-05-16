'use client';
import FooterSection from "@/components/Section/FooterSection";
import HeaderSection from "@/components/Section/HeaderSection";
import HotelCard from "@/components/HotelCard";
import MySearchHeader from '@/components/MySearchHeader';
import NavbarPages from '@/components/NavbarPages';
import { IoBed, IoHomeOutline } from "react-icons/io5";
import { useState, useEffect } from "react";
import { getAllKategori } from "@/app/Server/Kategori/data";
import { Spinner, Pagination } from "@heroui/react";
import Link from "next/link";
import debounce from "lodash.debounce";

type responseKategori = Awaited<ReturnType<typeof getAllKategori>>;
type KategoriDataShow = responseKategori['data']

const DetailHotel = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<KategoriDataShow | []>([]);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [pageTotal, setPageTotal] = useState(1);
    const [totalData, setTotalData] = useState(0);

    const fetchDataKategori = async (page: number, limit: number, search: string) => {
        setLoading(true);
        const data = await getAllKategori({page, limit, search});
        setData(data.data);
        setPageTotal(data.totalPage);
        setPage(data.currentPage);
        setTotalData(data.totalData);
        setLoading(false)
    }

    useEffect(() => {
        fetchDataKategori(page, 12, search);
    }, [page, search]);

    const handleSearch = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
    }, 500)

  return (
    <>
        <NavbarPages isHeaderSection/>
        <section className="w-full">
            <HeaderSection>
                <h1 className="md:text-3xl text-gray-300 text-center mb-2 font-bold text-xl">List Kategori Yang Terdaftar</h1>
                <p className="md:text-lg text-gray-300 text-[15px] text-center">Ini Adalah List Kategori Acak Yang Terdaftar Di Platfrom Kami</p>
                <MySearchHeader onChange={handleSearch} placeholder="Cari Kategori Atau Nama Hotel..."/>
            </HeaderSection>


            {!loading ? (
                totalData && totalData !== 0 ? (
                <>
                <div className="section-padding mt-20">
                    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 md:gap-x-5">
                        {data.map((kategori, i) => (
                            <HotelCard key={i} data={{image: "/" + kategori.image,nama: kategori.kategori, url: "/kategori/" + kategori.id, buttonText: "Lihat Kamar", bintang: kategori.rating}} index={i}>
                                <p className="dark:text-gray-400 text-gray-700 text-[15px] mt-1 flex items-center gap-1"><Link href={"/hotel/" + kategori.hotel_id} className="flex justify-center items-center gap-1 hover:text-blue-500 transition"><IoHomeOutline/> {kategori.nama_hotel}</Link></p>
                                <p className="dark:text-gray-400 text-gray-700 text-[15px] mt-1 flex items-center gap-1"><IoBed/> {kategori.total_kamar} Kamar Didalamnya</p>
                            </HotelCard>
                        ))}
                    </div>
                </div>
                <div className="flex justify-center mt-5">
                    <Pagination
                    page={page}
                    total={pageTotal}
                    onChange={setPage}
                    variant={'bordered'}
                    color="default"
                    />
                </div>
                </>
            ) : (
                <div className="mt-20 flex justify-center text-2xl font-bold">Tidak Ada Data Kategori</div>
            )) : (
                <div className="mt-20 flex justify-center text-lg font-bold items-center gap-3"><Spinner color="primary" classNames={{dots: ['bg-gray-900', 'dark:bg-white-50']}} variant="wave" label="Memuat Data..."/></div>
            )}
        </section>
        <FooterSection/>
    </>
  )
}

export default DetailHotel
