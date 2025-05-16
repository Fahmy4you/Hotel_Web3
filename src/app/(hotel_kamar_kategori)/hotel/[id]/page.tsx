'use client';
import FooterSection from "@/components/Section/FooterSection";
import HeaderSection from "@/components/Section/HeaderSection";
import HotelCard from "@/components/Card/HotelCard";
import { IoBed, IoFastFood, IoFileTrayStacked, IoLocationOutline, IoStar, IoCard } from "react-icons/io5";
import { FaMoneyBill } from "react-icons/fa6";
import MySearchHeader from '@/components/MySearchHeader';
import Link from "next/link";
import NavbarPages from '@/components/NavbarPages';
import { redirect, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import debounce from "lodash.debounce";
import { getAllKamarByHotel } from "@/app/Server/Kamar/Data/data";
import { formatRupiah } from '@/utils/Helper';
import { Spinner, Pagination } from "@heroui/react";
import { getHotelById } from "@/app/Server/Hotel/Data/data";
import TitleHeader from "@/components/TitleHeader";
import GlowCard from "@/components/Card/GlowCard";
import { getRatingByHotel } from "@/app/Server/Rating/Hotel/data";
import Avatar from "react-avatar";

type responseKamar = Awaited<ReturnType<typeof getAllKamarByHotel>>;
type KamarDataByHotel = responseKamar['data'];

type responseRating = Awaited<ReturnType<typeof getRatingByHotel>>;
type HotelRating = responseRating['ratings'];

const DetailHotel = () => {
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<KamarDataByHotel | []>([]);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [pageTotal, setPageTotal] = useState(1);
    const [totalData, setTotalData] = useState(0);
    const [dataHotel, setDataHotel] = useState<Awaited<ReturnType<typeof getHotelById>>>(null);
    const [loadingHotel, setLoadingHotel] = useState(false);
    const [testimonials, setTestimonials] = useState<HotelRating | []>([]);
    const [pageTesti, setPageTesti] = useState(1);
    const [pageTotalTesti, setPageTotalTesti] = useState(1);
    const [totalDataTesti, setTotalDataTesti] = useState(0);
    const [loadingTesti, setLoadingTesti] = useState(false);
    

    async function fetchData(page: number, limit: number, search: string) {
        setLoading(true)
        const data = await getAllKamarByHotel({page, limit, search, hotel_id: Number(params.id)});
        setPageTotal(data.totalPage);
        setPage(data.currentPage);
        setTotalData(data.totalData);
        setData(data.data);
        setLoading(false)
    }

    async function fetchDataHotel() {
        setLoadingHotel(true);
        const data = await getHotelById(Number(params.id));
        if(!data) {
            redirect('/404');
        }
        setDataHotel(data);
        setLoadingHotel(false);
    }

    async function fetchDataTesti(page: number, limit: number) {
        setLoadingTesti(true);
        const data = await getRatingByHotel({page, limit, hotel_id: Number(params.id)})
        setTestimonials(data.ratings);
        setPageTotalTesti(data.totalPage);
        setPageTesti(data.currentPage);
        setTotalDataTesti(data.totalData);
        setLoadingTesti(false);
    }

    useEffect(() => {
        fetchDataHotel();
    }, [])
    
    useEffect(() => {
        fetchData(page, 12, search);
    }, [search, page])

    useEffect(() => {
        fetchDataTesti(pageTesti, 12);
    }, [pageTesti])

    const handleSearch = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
    }, 500)


  return (
    <>
        <NavbarPages isHeaderSection/>
        <section className="w-full">
            <HeaderSection>
                <h1 className="md:text-3xl text-gray-300 text-center mb-2 font-bold text-xl">{loadingHotel ? `Memuat...` : `List Kamar Di ${dataHotel?.nama_hotel}`}</h1>
                <div className="md:text-lg text-gray-300 text-[15px] text-center flex gap-3 flex-col md:flex-row">
                    <p className="flex text-gray-300 items-center gap-1"><IoLocationOutline/> {loadingHotel ? `Memuat...` : `${dataHotel?.lokasi}`}</p>
                    <p className="flex text-gray-300 items-center gap-1"><IoBed/> {loadingHotel ? `Memuat...` : `${dataHotel?._count.kamars} Kamar`}</p>
                    <p className="flex text-gray-300 items-center gap-1"><IoStar/> {loadingHotel ? `Memuat...` : `${dataHotel?.ratingAvg.bintang ? dataHotel?.ratingAvg.bintang : 0}`}</p>
                </div>
                <MySearchHeader onChange={handleSearch} placeholder="Cari Nama Kamar Atau Kategori..."/>
            </HeaderSection>

            {!loading ? (
                totalData && totalData !== 0 ? (
                <>
                <div className="section-padding mt-20">
                    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 md:gap-x-5">
                        {data.map((data, i) => (
                            <HotelCard key={i} showBintang={false} data={{image: data.images && "/" + data.images[0] as string, nama: data.nama_kamar, url: "/kamar/" + data.id}} index={i}>
                                <p className="text-gray-700 dark:text-gray-400 text-[15px] mt-1 flex items-center gap-1"><Link href={"/kategori/" + data.kategori_id} className="flex justify-center items-center gap-1 hover:text-blue-500 transition"><IoFileTrayStacked/>{data.kategori}</Link></p>
                                <p className="text-gray-700 dark:text-gray-400 text-[15px] mt-1 flex items-center gap-1"><FaMoneyBill/> {formatRupiah(data.price)} / Hari</p>
                                <p className="text-gray-700 dark:text-gray-400 text-[15px] mt-1 flex items-center gap-1"><IoCard/> {data.is_kyc ? "Iya" : "Tidak"} KYC</p>
                                <p className="text-gray-700 dark:text-gray-400 text-[15px] mt-1 flex items-center gap-1 mb-4"><IoFastFood/> {data.features.length} Fitur Didalamnya</p>
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
                <div className="mt-20 flex justify-center text-2xl font-bold">Tidak Ada Data Kamar Di {dataHotel?.nama_hotel}</div>
            )) : (
                <div className="mt-20 flex justify-center text-lg font-bold items-center gap-3"><Spinner color="primary" classNames={{dots: ['bg-gray-900', 'dark:bg-white-50']}} variant="wave" label="Memuat Data..."/></div>
            )}
            
        </section>

        <section id="testimoni" className="flex-center section-padding">
            <div className="w-full h-full md:px-10 px-5">
            <TitleHeader title="Testimonial Hotel" sub={`Testimonial ${dataHotel?.nama_hotel} 🤩🏩`}/>
            
            {!loadingTesti ? (
                testimonials && testimonials.length != 0 ? (
                <>
                    <div className="lg:columns-3 md:columns-2 columns-1 mt-16">
                        {testimonials.map((testimonial, i) => (
                            <GlowCard key={i} card={{review: testimonial.komentar, bintang:  testimonial.bintang}} index={i}>
                                <div className='flex items-center gap-3'>
                                    <div>
                                        {testimonial.profile ? (
                                            <img src={"/" + testimonial.profile} alt={testimonial.profile} />
                                        ) : (
                                            <Avatar size="46" className="rounded-full" name={testimonial.nama ?? "U"}/>
                                        )}
                                    </div>
                                    <div>
                                        <p className='font-bold'>{testimonial.nama}</p>
                                        <p className='text-gray-800 dark:text-white-50'>{testimonial.role}</p>
                                    </div>
                                </div>
                            </GlowCard>
                        ))}
                    </div>
                    <div className="flex justify-center mt-5">
                        <Pagination
                        page={pageTesti}
                        total={pageTotalTesti}
                        onChange={setPageTesti}
                        variant={'bordered'}
                        color="default"
                        />
                    </div>
                </>
            ) : (
                <div className="mt-20 flex justify-center text-2xl font-bold">Tidak Ada Data Testimonial Di {dataHotel?.nama_hotel}</div>
            )) : (
                <div className="mt-20 flex justify-center text-lg font-bold items-center gap-3"><Spinner color="primary" classNames={{dots: ['bg-gray-900', 'dark:bg-white-50']}} variant="wave" label="Memuat Data..."/></div>
            )}
            </div>
        </section>
        <FooterSection/>
    </>
  )
}

export default DetailHotel
