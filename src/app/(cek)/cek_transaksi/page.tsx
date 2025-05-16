'use client'
import NavbarPages from '@/components/NavbarPages';
import HeaderSection from '@/components/Section/HeaderSection';
import MySearchHeader from '@/components/MySearchHeader';
import { Accordion, AccordionItem } from '@heroui/react';
import debounce from 'lodash.debounce';
import { formatRupiah, potongText } from '@/utils/Helper';
import FooterSection from '@/components/Section/FooterSection';
import { FaPersonWalking, FaPersonWalkingWithCane, FaPersonWalkingLuggage } from 'react-icons/fa6';
import BadgeUI from '@/components/BadgeUI';
import { useMediaQuery } from 'react-responsive';
import { Tooltip } from '@heroui/react';


const CekTransaksi = () => {    
    const is600Px = useMediaQuery({ query: '(max-width: 600px)' });
    const is500Px = useMediaQuery({ query: '(max-width: 500px)' });
    const is420Px = useMediaQuery({ query: '(max-width: 420px)' });
    let status = 1;

    const cutTextDisplay = (text: string, is600 = true) => {
        if(is420Px) {
            return potongText(text, 15)
        } else if(is500Px) {
            return potongText(text, 23)
        } else if(is600Px && is600) {
            return potongText(text, 35)
        } else {
            return text
        }
    }

    const getIcon = (status: number): React.ReactNode => {
        switch(status) {
            case 1:
                return <FaPersonWalkingLuggage size={is420Px ? 25 : 35} className='font-bold text-blue-500'/>
            case 2:
                return <FaPersonWalkingWithCane size={is420Px ? 25 : 35} className='font-bold text-red-500'/>
            default:
                return <FaPersonWalking size={is420Px ? 25 : 35} className='font-bold text-orange-400'/>
        }
    }

    const handleCopy = async (text: string) => {
        await navigator.clipboard.writeText(text)
    }


    const handleSearch = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value)
    }, 500)


  return (
    <>
        <NavbarPages isHeaderSection/>
        <section className="w-full">
            <HeaderSection>
                <h1 className="md:text-3xl text-gray-300 text-center mb-2 font-bold text-xl">List Transaksi Semua Hotel</h1>
                <p className="md:text-lg text-gray-300 text-[15px] text-center">List Transaksi Yang Diambil Secara On Chain Di Smart Contract</p>
                <MySearchHeader onChange={handleSearch} placeholder="Cari Transaksi Berdasarkan ID Transaksi..."/>
            </HeaderSection>

            <div className="section-padding mt-20">
                <Accordion variant="shadow" itemClasses={{
                    trigger: "px-2 py-5 cursor-pointer data-[hover=true]:bg-default-100 rounded-lg flex items-center font-bold",
                    content: `px-8 mb-5 ${is600Px ? "text-[15px]" : "text-sm md:text-[15px]"}`,
                }}>
                    {[1,2,3,4,5].map((_, i) => (
                        <AccordionItem startContent={getIcon(status)} title={
                                <span>{cutTextDisplay("0x510DeD3072ac6967827A498360eDB0edf77BE542")}</span>
                        } subtitle={
                            <div className={`${is420Px ? 'hidden' : 'flex'} mt-2 gap-x-2`}>
                                <BadgeUI variant={status == 1 ? 'success' : status == 2 ? 'error' : 'warning'}>
                                    <span>Transaksi Pending</span>
                                </BadgeUI>
                                <BadgeUI variant="primary">
                                    <span>22-02-2025</span>
                                </BadgeUI>
                            </div>
                        }>
                            <div className={`${is600Px ? 'hidden' : 'flex'} gap-x-3`}>
                                <div className="flex flex-col gap-y-5">
                                    <span>ID Transaksi</span>
                                    <span>Address</span>
                                    <span>Hotel Address</span>
                                    <span>Nominal</span>
                                    <span>Status</span>
                                    <span>Tgl. Transaksi</span>
                                </div>
                                <div className="flex flex-col gap-y-5">
                                    {Array.from({length: 6}, (_, i) => (
                                        <span key={i}> : </span>
                                    ))}
                                </div>
                                <div className="flex flex-col gap-y-5">
                                    <span>1</span>
                                    <Tooltip content="Klik Untuk Salin">
                                        <span onClick={() => handleCopy('0x510DeD3072ac6967827A498360eDB0edf77BE542')} className='cursor-pointer'>0x510DeD3072ac6967827A498360eDB0edf77BE542</span>
                                    </Tooltip>
                                    <Tooltip content="Klik Untuk Salin">
                                        <span onClick={() => handleCopy('0x510DeD3072ac6967827A498360eDB0edf77BE542')} className='cursor-pointer'>0x510DeD3072ac6967827A498360eDB0edf77BE542</span>
                                    </Tooltip>
                                    <span>{formatRupiah(1200000)}</span>
                                    <span><BadgeUI variant={status == 1 ? 'success' : status == 2 ? 'error' : 'warning'}><span>Transaksi Sukses</span></BadgeUI></span>
                                    <span>25-02-2025</span>
                                </div>
                            </div>

                            <div className={`${is600Px ? 'flex' : 'hidden'} flex-col`}>
                                <div className="flex flex-col space-y-5">
                                    <div className="flex flex-col space-y-1">
                                        <span className='font-semibold'>ID Transaksi</span>
                                        <span>1</span>
                                    </div>
                                    <div className="flex flex-col space-y-1">
                                        <span className='font-semibold'>Address</span>
                                        <Tooltip content="Klik Untuk Salin">
                                            <span onClick={() => handleCopy('0x510DeD3072ac6967827A498360eDB0edf77BE542')}>{cutTextDisplay("0x510DeD3072ac6967827A498360eDB0edf77BE542")}</span>
                                        </Tooltip>
                                    </div>
                                    <div className="flex flex-col space-y-1">
                                        <span className='font-semibold'>Hotel Address</span>
                                        <Tooltip content="Klik Untuk Salin">
                                            <span onClick={() => handleCopy('0x510DeD3072ac6967827A498360eDB0edf77BE542')}>{cutTextDisplay("0x510DeD3072ac6967827A498360eDB0edf77BE542")}</span>
                                        </Tooltip>
                                    </div>
                                    <div className="flex flex-col space-y-1">
                                        <span className='font-semibold'>Nominal</span>
                                        <span>{formatRupiah(1200000)}</span>
                                    </div>
                                    <div className="flex flex-col space-y-1">
                                        <span className='font-semibold'>Status</span>
                                        <span><BadgeUI variant={status == 1 ? 'success' : status == 2 ? 'error' : 'warning'}><span>Transaksi Pending</span></BadgeUI></span>
                                    </div>
                                    <div className="flex flex-col space-y-1">
                                        <span className='font-semibold'>Tgl. Transaksi</span>
                                        <span>25-02-2025</span>
                                    </div>
                                </div>
                            </div>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
        <FooterSection/>
    </>
  )
}

export default CekTransaksi
