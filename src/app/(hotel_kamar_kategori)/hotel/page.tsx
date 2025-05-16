"use client"
import FooterSection from "@/components/Section/FooterSection";
import HeaderSection from "@/components/Section/HeaderSection";
import HotelCard from "@/components/Card/HotelCard";
import { IoLocationOutline, IoBed } from "react-icons/io5";
import MySearchHeader from '@/components/MySearchHeader';
import NavbarPages from '@/components/NavbarPages';
import { getAllHotel } from "@/app/Server/Hotel/Data/data";
import HotelCard from "@/components/Card/HotelCard"
import { IoLocationOutline, IoBed } from "react-icons/io5";
import { useEffect, useState } from "react";
import { potongText } from '../../../utils/Helper';
import { Pagination } from "@heroui/react";
import debounce from "lodash.debounce";
import { Spinner } from "@heroui/react";

type responseType = Awaited<ReturnType<typeof getAllHotel>>;
type HotelDataType = responseType['hotels'];

const ListHotel = () => {
    const [loading, setLoading] = useState(false);
    const [topHotels, setTopHotels] = useState<HotelDataType | []>([]);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [pageTotal, setPageTotal] = useState(1);
    const [totalData, setTotalData] = useState(0);


    async function getTopHotels(page: number, limit: number, search: string) {
        setLoading(true)
        const getHotels = await getAllHotel({page, limit, search});
        setPageTotal(getHotels.totalPage);
        setPage(getHotels.currentPage);
        setTotalData(getHotels.totalData);
        setTopHotels(getHotels.hotels);
        setLoading(false)
    }
    
    useEffect(() => {
        getTopHotels(page, 12, search);
    }, [search, page])

    const handleSearch = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
    }, 500)


  return (
    <>
        <NavbarPages isHeaderSection/>
        <section className="w-full">
            <HeaderSection>
                <h1 className="md:text-3xl text-gray-300 text-center mb-2 font-bold text-xl">List Hotel Yang Terdaftar</h1>
                <p className="md:text-lg text-gray-300 text-[15px] text-center">Ini Adalah List Hotel Yang Terdaftar Di Platform Kami</p>
                <MySearchHeader onChange={handleSearch}/>
            </HeaderSection>

            {!loading ? (
            totalData && totalData !== 0 ? (
                <>
                <div className="section-padding mt-20">
                    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 md:gap-x-5">
                    {topHotels.map((hotel, i) => (
                        <HotelCard
                        key={i}
                        data={{
                            image: hotel.images && hotel.images[0] as string,
                            nama: hotel.nama_hotel,
                            bintang: hotel.rating,
                            url: "/hotel/" + hotel.id,
                            buttonText: "Lihat Kamar"
                        }}
                        index={i}
                        >
                        <p className="text-gray-700 dark:text-gray-400 text-[15px] mt-1 flex items-center gap-1">
                            <IoLocationOutline /> {potongText(hotel.lokasi, 30)}
                        </p>
                        <p className="text-gray-700 dark:text-gray-400 text-[15px] mt-1 flex items-center gap-1">
                            <IoBed /> {hotel.total_kamar ?? 0} Kamar
                        </p>
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
                <div className="mt-20 flex justify-center text-2xl font-bold">Tidak Ada Data Hotel</div>
            )) : (
                <div className="mt-20 flex justify-center text-lg font-bold items-center gap-3"><Spinner color="primary" classNames={{dots: ['bg-gray-900', 'dark:bg-white-50']}} variant="wave" label="Memuat Data..."/></div>
            )}


            
        </section>
        <FooterSection/>
    </>
  )
}

export default ListHotel
