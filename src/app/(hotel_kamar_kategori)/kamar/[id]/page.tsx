'use client'
import FooterSection from '@/components/Section/FooterSection';
import { IoFastFood, IoFileTrayStacked, IoCashOutline, IoCaretForwardOutline } from 'react-icons/io5';
import { FaHotel } from 'react-icons/fa6'
import Link from 'next/link';
import NavbarPages from '@/components/NavbarPages';
import FormSubmitBooking from '@/components/Form/FormSubmitBooking';
import TableHeader from '@/components/TableAtom/TableHeader';
import { redirect, useParams } from 'next/navigation';
import TableFooter from '@/components/TableAtom/TableFooter';
import GenericRow from '@/components/TableAtom/GenericRow';
import WrapperTable from '@/components/root/WrapperTable';
import { useEffect, useState } from 'react';
import { Alert } from '@heroui/react';
import { useAuthApp } from '@/hooks/useAuthApp';
import { getKamarById } from '@/app/Server/Kamar/Data/data';
import { formatRupiah } from '@/utils/Helper';
import { getBookingByKamarId } from '@/app/Server/Booking/data';
import debounce from 'lodash.debounce';
import { Spinner } from '@heroui/react';

type responseBooking = Awaited<ReturnType<typeof getBookingByKamarId>>;
export type BookingByKamarType = responseBooking['data'];

const BookingKamar = () => {
    const params = useParams();
    const [loadingData, setLoadingData] = useState(false);
    const [data, setData] = useState<Awaited<ReturnType<typeof getKamarById>> | null>(null);
    const [loadingBooking, setLoadingBooking] = useState(false);
    const [dataBooking, setDataBooking] = useState<BookingByKamarType>([]);
    const [search, setSearch] = useState('');
    const [totalBooking, setTotalBooking] = useState(0);
    const [totalBookingPage, setTotalBookingPage] = useState(1);
    const [pageBooking, setPageBooking] = useState(1);

    const {user} = useAuthApp();

    async function fetchDataKamar() {
      setLoadingData(true);
      const data = await getKamarById(Number(params.id));
      if(!data) redirect('/404');
      setData(data)
      setLoadingData(false);
    }

    async function fetchDataBooking(page: number, limit: number, search: string) {
      setLoadingBooking(true);
      const data = await getBookingByKamarId({page, limit, search, kamar_id: Number(params.id)});
      setDataBooking(data.data);
      setTotalBooking(data.totalData);
      setTotalBookingPage(data.totalPage)
      setLoadingBooking(false);
    }

    useEffect(() => {
      fetchDataKamar();
    }, [])

    useEffect(() => {
      fetchDataBooking(pageBooking, 10, search);
    }, [search, pageBooking])

    const handleRefresh = () => {
      fetchDataBooking(pageBooking, 10, search);
    }

    const handleSearch = debounce((query: string) => {
        setSearch(query)
    }, 500);

    const col = ['Nama', 'Checkin', 'Checkout'];

  return (
    <>
        <NavbarPages/>
        <section className="w-full px-5 mt-5 lg:-mb-29 pt-20">
            {user ? (
                (!user.no_wa || !user.email) && <Alert color='warning' title='Tidak Bisa Booking, Lengkapi Profile Anda' description='Sudah Melengkapi ? Jika Masih Muncul Alert Ini Logout Dan Login Kembali' className='mb-3'/>
            ) : (
                <Alert color='warning' title='Tidak Bisa Booking, Connect Wallet Dulu' description='Sudah Login ? Refresh Halaman Jika Masih Muncul Alert' className='mb-3'/>
            )}
            <div className="flex gap-5 flex-1 flex-col lg:flex-row">
                <div className="lg:w-[65%] w-full">
                    <img src="/image/kenapa.jpeg" alt="Gambar Kamar" className="w-full h-[500px] rounded-md object-cover" />
                </div>
                <div className="lg:w-[35%] w-full px-5 pt-5 space-y-4 h-[500px] bg-gray-300 dark:bg-black-100 rounded-md">
                    <h2 className='font-bold text-xl md:text-2xl'>Data Booking Anda</h2>
                    <FormSubmitBooking user={user} harga={data?.price ?? 0} detailBooking={data}/>
                </div>
            </div>
            <div className='mt-5'>
                <div className="flex items-center gap-3 flex-col lg:flex-row">
                    <h1 className='md:text-3xl text-xl font-bold'>{loadingData ? `Memuat...` : `${data?.nama_kamar}`}</h1>
                    <div className="flex gap-x-3">
                        <p className="text-gray-800 dark:text-gray-400 md:text-lg text-[15px] flex items-center gap-1"><Link href="/" className="flex justify-center items-center gap-1 hover:text-blue-500 transition">
                          <FaHotel/> {loadingData ? `Memuat...` : `${data?.hotel?.nama_hotel}`}</Link>
                        </p>
                        <p className="text-gray-800 dark:text-gray-400 md:text-lg text-[15px]">|</p>
                        <p className="text-gray-800 dark:text-gray-400 md:text-lg text-[15px] flex items-center gap-1"><Link href="/" className="flex justify-center items-center gap-1 hover:text-blue-500 transition">
                          <IoFileTrayStacked/> {loadingData ? `Memuat...` : `${data?.kategori?.kategori}`}</Link>
                        </p>
                    </div>
                </div>
                <div className="space-y-4 mt-3">
                    <p className="text-gray-800 dark:text-gray-400 md:text-[15px] text-[13px] flex items-center gap-1">{loadingData ? `Memuat...` : `${data?.desk}`}</p>
                    <p className="text-gray-800 dark:text-gray-400 md:text-lg text-[15px] flex items-center gap-1"><IoCashOutline/> {loadingData ? `Memuat...` : `${data?.price && formatRupiah(data?.price)} IDRX/Malam`}</p>
                    <p className="text-gray-800 dark:text-gray-400 md:text-lg text-[15px] flex items-center gap-1"><IoFastFood/> {loadingData ? `Memuat...` : `${data?.features.length}`} Fitur Didalamnya</p>
                    <ul className='ml-4 mt-2 flex flex-col gap-y-2'>
                      {!loadingData ? (
                        data?.features && data.features.length != 0 ? (
                          data.features.map((data, index) => (
                            <li key={index} className='flex items-center gap-1 text-gray-800 dark:text-gray-400'><IoCaretForwardOutline/> {data}</li>
                          ))
                        ) : (
                          <li className='flex items-center gap-1 text-gray-800 dark:text-gray-400'><IoCaretForwardOutline/> Tidak Ada Fitur</li>
                        )
                      ) : (
                        <li className='flex items-center gap-1 text-gray-800 dark:text-gray-400'>Memuat...</li>
                      )}
                    </ul>
                    
                </div>
            </div>

            <div className="mt-7">
                <WrapperTable>
                      <TableHeader title="Data Booking" placeholder='Cari Booking...'
                        onSearch={handleSearch} handleRefresh={handleRefresh} />
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-400 dark:divide-gray-800 transition-colors">
                          <thead className="bg-gray-100 dark:bg-black-50 transition-colors">
                            <tr>
                              {col.map((column) => (
                                <th
                                  key={column}
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  {column}
                                </th>
                              ))}
                            </tr>
                          </thead>
                
                          <tbody className="bg-slate-100 dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-gray-800 transition-colors">
                            {!loadingBooking && dataBooking.length !== 0 && (
                              dataBooking.map((item, index) => (
                                <GenericRow
                                  key={item.id}
                                  data={item}
                                  columns={['user_booking', 'tanggal_checkin', 'tanggal_checkout']}
                                />
                              ))
                            )}
                          </tbody>
                        </table>
                
                        {!loadingBooking && dataBooking.length === 0 && (
                          <div className="text-center py-8">
                            <p className="text-gray-500">Data Booking Tidak Ada</p>
                          </div>
                        )}
                        {loadingBooking && (
                          <div className="pb-2 flex justify-center text-lg font-bold items-center gap-3"><Spinner color="primary" classNames={{dots: ['bg-gray-900', 'dark:bg-white-50']}} variant="wave" label="Memuat Data..."/></div>
                        )}
                      </div>
                      <TableFooter itemCount={totalBooking} itemName="Booking Data" onPrev={() => setPageBooking(pageBooking != 1 ? pageBooking - 1 : 1)} onNext={() => setPageBooking(pageBooking != totalBookingPage ? pageBooking + 1 : pageBooking)} />
                    </WrapperTable>
            </div>
        </section>
        <FooterSection/>
    </>
  )
}

export default BookingKamar
