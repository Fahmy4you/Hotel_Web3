import {FaInstagram, FaTiktok, FaLinkedin, FaFacebook} from "react-icons/fa6"
const FooterSection = () => {
    const hotels = [
        {
            id: 1,
            nama_hotel: "Hotel HGI"
        },
        {
            id: 2,
            nama_hotel: "Orchard Hotel"
        },
        {
            id: 3,
            nama_hotel: "Kempinski Hotel"
        },
        {
            id: 4,
            nama_hotel: "Hotel Indonesia Group"
        },
        {
            id: 5,
            nama_hotel: "Rixos Hotel"
        },
    ];

    const kategoris = [
        {
            id: 1,
            kategori: "Kamar Luxury"
        },
        {
            id: 2,
            kategori: "Kamar Ekonomi"
        },
        {
            id: 3,
            kategori: "Kamar Super"
        },
        {
            id: 4,
            kategori: "Kamar Kelas C"
        },
        {
            id: 5,
            kategori: "Kamar Kelas A"
        },
    ];

    const socialMedia = [
        {
            icon: <FaInstagram/>,
            link: 'https://instagram.com'
        },
        {
            icon: <FaTiktok/>,
            link: 'https://tiktok.com'
        },
        {
            icon: <FaFacebook/>,
            link: 'https://facebook.com'
        },
        {
            icon: <FaLinkedin/>,
            link: 'https://linkedin.com'
        },
    ]

  return (
    <footer className='section-padding pt-5 md:pt-10 w-full bg-gray-200 dark:bg-black-100'>
        <div className="grid-4-cols">
            <div>
                <a href="/" className='text-xl md:text-2xl font-bold hover:text-gray-400 transition'>FK Hotel | Web3</a>
                <p className='md:text-[15px] text-gray-800 dark:text-white-50 text-[12px] mt-5'>FK Hotel adalah platform booking hotel secara semi desentralise dan pembayaran nya menggunakan stable coin indonesia yaitu IDRX</p>
            </div>
            <div>
                <h3 className='text-lg font-semibold'>Hotel</h3>
                <ul className='list-none'>
                    {hotels.map((hotel, i) => (
                        <li className='md:text-[15px] text-white-100 text-[12px] mt-5 hover:text-gray-400 transition' key={i}>
                            <a href={"http://localhost:3000/hotel/" + hotel.id}>{hotel.nama_hotel}</a>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h3 className='text-lg font-semibold'>Kategori</h3>
                <ul className='list-none'>
                    {kategoris.map((kategori, i) => (
                        <li className='md:text-[15px] text-white-100 text-[12px] mt-5 hover:text-gray-400 transition' key={i}>
                            <a href={"http://localhost:3000/hotel/" + kategori.id}>{kategori.kategori}</a>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h3 className='text-lg font-semibold'>Sosial Media</h3>
                <div className='flex gap-5 mt-3'>
                    {socialMedia.map((media, i) => (
                        <a key={i} href={media.link} className="size-10 border-1 flex justify-center items-center rounded-full hover:bg-gray-800 dark:hover:bg-white-50 bg-transparent hover:text-gray-200 dark:hover:text-black-50 transition border-gray-800 dark:border-white-50 p-2 contact-btn group">
                            <span>{media.icon}</span>
                        </a>
                    ))}
                </div>
            </div>
        </div>
        <div className="flex items-center justify-center md:text-[14px] text-[12px] mt-5 border-t border-gray-700 dark:border-white-50 py-5 md:py-3">&copy; Copyright FK Hotel | Web3 2025</div>
    </footer>
  )
}

export default FooterSection
