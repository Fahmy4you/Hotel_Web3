'use client';
import FooterSection from "@/components/Section/FooterSection";
import HeaderSection from "@/components/Section/HeaderSection";
import HotelCard from "@/components/Card/HotelCard";
import { IoFastFood, IoBed, IoLocationOutline, IoStar, IoHomeOutline, IoCard } from "react-icons/io5";
import { FaMoneyBill } from "react-icons/fa6";
import { formatRupiah } from "@/utils/Helper";
import MySearchHeader from '@/components/MySearchHeader';
import Link from "next/link";
import NavbarPages from '@/components/NavbarPages';
import { redirect, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { getKategoriDataIdIncludeHotel } from "@/app/Server/Kategori/data";
import { getAllKamarByKategori } from "@/app/Server/Kamar/Data/data";
import { Pagination, Spinner } from "@heroui/react";
import debounce from "lodash.debounce";

type GetAllKamarByKategoriResponse = Awaited<ReturnType<typeof getAllKamarByKategori>>;
type KamarDataType = GetAllKamarByKategoriResponse['data'];

const DetailHotel = () => {
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<Awaited<ReturnType<typeof getKategoriDataIdIncludeHotel>> | null>(null);
    const [search, setSearch] = useState('');
    const [loadingKamar, setLoadingKamar] = useState(false);
    const [dataKamar, setDataKamar] = useState<KamarDataType | []>([]);
    const [pageKamar, setPageKamar] = useState(1);
    const [pageKamarTotal, setPageKamarTotal] = useState(1);
    const [totalDataKamar, setTotalDataKamar] = useState(0);


    async function getDataKategori(kategori_id: number) {
        setLoading(true);
        const data = await getKategoriDataIdIncludeHotel(kategori_id);
        if(!data) {
            redirect('/404')
        }
        setData(data);
        setLoading(false);
    }

    async function fetchDataKamar(page: number, limit: number, search: string, kategori_id: number) {
        setLoadingKamar(true);
        const data = await getAllKamarByKategori({page, limit, search, kategori_id})
        setDataKamar(data.data);
        setPageKamarTotal(data.totalPage);
        setPageKamar(data.currentPage);
        setTotalDataKamar(data.totalData);
        setLoadingKamar(false);
    }

    useEffect(() => {
        getDataKategori(Number(params.id));
    }, [])

    useEffect(() => {
        fetchDataKamar(pageKamar, 12, search, Number(params.id));
    }, [pageKamar, search])

    const handleSearch = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
    }, 500)

  return (
    <>
        <NavbarPages isHeaderSection/>
        <section className="w-full">
            <HeaderSection>
                <h1 className="md:text-3xl text-gray-300 text-center mb-2 font-bold text-xl">{loading ? `Memuat...` : `List Kamar Di Kategori ${data?.kategori}`}</h1>
                <div className="md:text-lg text-gray-300 text-[15px] text-center flex gap-3 flex-col md:flex-row">
                    <p className="flex text-gray-300 items-center gap-1"><IoHomeOutline/> {loading ? `Memuat...` : `${data?.hotel?.nama_hotel}`}</p>
                    <p className="flex text-gray-300 items-center gap-1"><IoLocationOutline/> {loading ? `Memuat...` : `${data?.hotel?.lokasi}`}</p>
                    <p className="flex text-gray-300 items-center gap-1"><IoBed/> {loading ? `Memuat...` : `${data?.total_kamar} Kamar`}</p>
                    <p className="flex text-gray-300 items-center gap-1"><IoStar/> {loading ? `Memuat...` : `${data?.hotel?.rating ? data?.hotel?.rating : 0}`}</p>
                </div>
                <MySearchHeader onChange={handleSearch} placeholder="Cari Nama Kamar Atau Kategori..."/>
            </HeaderSection>

            {!loadingKamar ? (
                totalDataKamar && totalDataKamar !== 0 ? (
                <>
            <div className="section-padding mt-20">
                <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 md:gap-x-5">
                    {dataKamar.map((data, i) => (
                        <HotelCard showBintang={false} key={i} data={{image: "/" + data.images[0],nama: data.nama_kamar, url: "/kamar/" + data.id}} index={i}>
                            <p className="text-gray-700 dark:text-gray-400 text-[15px] mt-1 flex items-center gap-1"><Link href={"/hotel/" + data.hotel_id} className="flex justify-center items-center gap-1 hover:text-blue-500 transition"><IoHomeOutline/>{data.nama_hotel}</Link></p>
                            <p className="text-gray-700 dark:text-gray-400 text-[15px] mt-1 flex items-center gap-1"><FaMoneyBill/> {formatRupiah(data.price)} / Hari</p>
                            <p className="text-gray-700 dark:text-gray-400 text-[15px] mt-1 flex items-center gap-1"><IoCard/> {data.is_kyc ? "Iya" : "Tidak"} KYC</p>
                            <p className="text-gray-700 dark:text-gray-400 text-[15px] mt-1 flex items-center gap-1 mb-4"><IoFastFood/> {data.features.length} Fitur Didalamnya</p>
                        </HotelCard>
                    ))}
                </div>
            </div>
            <div className="flex justify-center mt-5">
                    <Pagination
                    page={pageKamar}
                    total={pageKamarTotal}
                    onChange={setPageKamar}
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
