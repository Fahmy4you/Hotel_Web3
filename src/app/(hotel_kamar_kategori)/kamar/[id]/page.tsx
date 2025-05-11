import FooterSection from '@/components/FooterSection';
import { IoFastFood, IoFileTrayStacked, IoCashOutline } from 'react-icons/io5';
import { FaHotel } from 'react-icons/fa6'
import Link from 'next/link';
import NavbarPages from '@/components/NavbarPages';
import FormSubmitBooking from '@/components/FormSubmitBooking';


const BookingKamar = ({params}: {params?: {id?: string}}) => {
    const id = params?.id;

  return (
    <>
        <NavbarPages/>
        <section className="w-full px-5 mt-5 md:-mb-29 pt-20">
            <div className="flex gap-5 flex-1 flex-col md:flex-row">
                <div className="md:w-[65%] w-full">
                    <img src="/image/kenapa.jpeg" alt="Gambar Kamar" className="w-full h-[500px] rounded-md object-cover" />
                </div>
                <div className="md:w-[35%] w-full px-5 pt-5 space-y-4 h-[500px] bg-gray-300 dark:bg-black-100 rounded-md">
                    <h2 className='font-bold text-xl md:text-2xl'>Data Booking Anda</h2>
                    <FormSubmitBooking/>
                </div>
            </div>
            <div className='mt-5'>
                <div className="flex items-center gap-3 flex-col md:flex-row">
                    <h1 className='md:text-3xl text-xl font-bold'>Kamar Luxury Rusian</h1>
                    <div className="flex gap-x-3">
                        <p className="text-gray-800 dark:text-gray-400 md:text-lg text-[15px] flex items-center gap-1"><Link href="/" className="flex justify-center items-center gap-1 hover:text-blue-500 transition"><FaHotel/>Hotel HGI Indonesia</Link></p>
                        <p className="text-gray-800 dark:text-gray-400 md:text-lg text-[15px]">|</p>
                        <p className="text-gray-800 dark:text-gray-400 md:text-lg text-[15px] flex items-center gap-1"><Link href="/" className="flex justify-center items-center gap-1 hover:text-blue-500 transition"><IoFileTrayStacked/>Kamar Luxury</Link></p>
                    </div>
                </div>
                <div className="space-y-4 mt-3">
                    <p className="text-gray-800 dark:text-gray-400 md:text-[15px] text-[13px] flex items-center gap-1">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Soluta doloremque molestiae rem nesciunt harum. Omnis delectus, nostrum quis, aperiam nisi mollitia similique ea, deserunt quia harum blanditiis earum. Illum a fuga, porro, reprehenderit necessitatibus, at iure eius soluta debitis quis exercitationem iusto? Modi aspernatur illo, nam sint cumque numquam consequuntur ab fuga dolore consectetur tempore omnis! Adipisci optio dolor in, earum accusantium aspernatur, voluptatem corporis, a illo ab inventore. Repudiandae quisquam reprehenderit nihil, quasi sequi deleniti quam eveniet dolorum aliquid repellat animi eum molestiae accusamus architecto perspiciatis magnam adipisci commodi nisi in, voluptatibus ad nemo accusantium. Voluptatibus deserunt magni voluptatum?</p>
                    <p className="text-gray-800 dark:text-gray-400 md:text-lg text-[15px] flex items-center gap-1"><IoCashOutline/> 123.000 IDRX/Malam</p>
                    <p className="text-gray-800 dark:text-gray-400 md:text-lg text-[15px] flex items-center gap-1"><IoFastFood/> 3 Fitur Didalamnya</p>
                    <ul className='ml-4 mt-2 flex flex-col gap-y-2'>
                        <li className='flex items-center gap-1 text-gray-800 dark:text-gray-400'>1. Kasur Besar 2 Orang</li>
                        <li className='flex items-center gap-1 text-gray-800 dark:text-gray-400'>2. Makan 3x Sehari</li>
                        <li className='flex items-center gap-1 text-gray-800 dark:text-gray-400'>3. Buah 1 Piring Besar</li>
                    </ul>
                    
                </div>
            </div>
        </section>
        <FooterSection/>
    </>
  )
}

export default BookingKamar
