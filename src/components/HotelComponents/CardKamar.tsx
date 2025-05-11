'use client';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { openModals,closeModals } from '../../../libs/slices/modalSlice';
import DetailKamarModals from '../Modals/Kamar/DetailKamarModals';
import { Star, Info, Edit2, Trash2 } from 'lucide-react';
import BadgeUI from '@/components/BadgeUI';
import { RootState } from '../../../libs/store';
import { KamarData } from '../../../types/kamarData';

// Contoh data statis untuk ditampilkan
const hotelRoom = {
  id: 1,
  nama_kamar: "Deluxe Ocean View",
  price: 1250000,
  is_banned: false,
  kategori_id: 2,
  hotel_id: 1,
  features: ["Free WiFi", "Breakfast", "Swimming Pool", "King Size Bed"],
  images: ["/api/placeholder/400/300"],
  rating: 4.7,
  kategori: "Premium"
};

export default function HotelRoomCard() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentDataKamar, setCurrentDataKamar] = useState<KamarData | null>(null);
  const dp = useDispatch(); // dp as Dispatch
  const modals = useSelector((state : RootState) => state.modals);
  
  // Format harga ke format Rupiah
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="flex flex-col md:flex-row bg-white dark:bg-neutral-900 rounded-lg shadow-md overflow-hidden  mx-auto">
      <div className="relative w-full md:w-2/5 h-48">
        <img
          src={hotelRoom.images[currentImageIndex]}
          alt={hotelRoom.nama_kamar}
          className="w-full h-full object-cover"
        />
        {hotelRoom.is_banned && (
          <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-0.5 m-2 text-xs rounded-md">
            Not Available
          </div>
        )}
      </div>
      
      {/* Bagian Informasi - Lebih compact */}
      <div className="w-full md:w-3/5 p-3 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Nama dan Rating */}
          <div className="flex justify-between items-start">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">{hotelRoom.nama_kamar}</h2>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span className="ml-1 text-gray-700 dark:text-white text-sm font-medium">{hotelRoom.rating}</span>
            </div>
          </div>
          
          {/* Badge Kategori */}
          <div className="flex items-center gap-2 mb-3">
            <BadgeUI variant="primary" size="md" active={true}>{hotelRoom.kategori}</BadgeUI>
          </div>
          
          {/* Features Badges */}
          <div className="flex flex-wrap gap-2">
            {hotelRoom.features.map((feature, index) => (
              <BadgeUI key={index} variant="default" size="md" active={true}>{feature}</BadgeUI>
            ))}
          </div>
        </div>
        
        {/* Harga dan Tombol-tombol Action */}
        <div className="flex justify-between items-center mt-3">
          <div>
            <p className="text-base font-bold text-gray-900 dark:text-white">{formatPrice(hotelRoom.price)}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">per malam</p>
          </div>
          
          {/* Tombol Action berbentuk badge dengan efek glow */}
          <div className="flex space-x-2">
            <button onClick={() => dp(openModals('detail'))}
             className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded-md text-xs shadow-md
              transition-all duration-200 hover:shadow-blue-400/50 dark:hover:shadow-blue-400/30 hover:shadow-lg">
              <Info className="h-3 w-3 mr-1" />
              Detail
            </button>
            
            <button className="flex items-center justify-center bg-amber-500 hover:bg-amber-600 text-white px-2 py-1 rounded-md text-xs shadow-md
              transition-all duration-200 hover:shadow-amber-400/50 dark:hover:shadow-amber-400/30 hover:shadow-lg">
              <Edit2 className="h-3 w-3 mr-1" />
              Edit
            </button>
            
            <button className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md text-xs shadow-md
              transition-all duration-200 hover:shadow-red-400/50 dark:hover:shadow-red-400/30 hover:shadow-lg">
              <Trash2 className="h-3 w-3 mr-1" />
              Delete
            </button>
          </div>
        </div>

        <DetailKamarModals isOpen={modals.detail} onClose={() => dp(closeModals('detail'))} title="Detail Kamar" />
      </div>
    </div>
  );
}