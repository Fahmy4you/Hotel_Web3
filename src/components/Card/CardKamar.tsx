'use client';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openModals, closeModals } from '../../../libs/slices/modalSlice';
import DetailKamarModals from '../Modals/Kamar/DetailKamarModals';
import { Info, Edit2, Trash2, Star } from 'lucide-react';
import BadgeUI from '@/components/AtomsComponent/BadgeUI';
import { RootState } from '../../../libs/store';
import { ActionButton } from '../Button/ActionButton';
import { KamarData } from '../../../types/kamarData';

interface KamarCardProps {
  kamar: KamarData;
}

export default function KamarCard({ kamar }: KamarCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const dispatch = useDispatch();
  const { detail: isDetailModalOpen } = useSelector((state: RootState) => state.modals);
  
  const getImageUrl = (): string => {
    // Handle empty or undefined images
    if (!kamar.images || kamar.images.length === 0) {
      return '/default-room-image.jpg';
    }

    // Get current image (handle both array and single image cases)
    let currentImage = Array.isArray(kamar.images) 
      ? kamar.images[currentImageIndex]
      : kamar.images;

    // Handle File objects
    if (currentImage instanceof File) {
      return URL.createObjectURL(currentImage);
    }

    // Handle string paths
    if (typeof currentImage === 'string') {
      // Clean up path (remove any unwanted characters)
      const cleanPath = currentImage
        .replace(/[{}]/g, '') // Remove curly braces
        .replace(/^\/+/, ''); // Remove leading slashes

      //Handle different path formats
      if (cleanPath.startsWith('uploads/')) {
        const filename = cleanPath.substring(cleanPath.lastIndexOf('/') + 1);
        return `/uploads/kamars/${filename}`;
      }

      if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://')) {
        return cleanPath;
      }
      return `/uploads/kamars/${cleanPath}`;
    }

    // Fallback to default image
    return '/default-room-image.jpg';
  };

  // Format harga ke format Rupiah
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Handler untuk membuka modal
  const handleOpenDetail = () => dispatch(openModals('detail'));
  const handleCloseDetail = () => dispatch(closeModals('detail'));

  return (
    <div className="group bg-white dark:bg-neutral-900 rounded-lg shadow-md overflow-hidden 
                transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg
                dark:hover:shadow-blue-900/20 hover:shadow-blue-300/30 w-full flex">
      {/* Gambar Kamar */}
      <div className="relative w-1/4 min-w-1/4 overflow-hidden">
        <img
          src={getImageUrl()}
          alt={kamar.nama_kamar}
          className="w-full h-full object-cover object-center transition-transform duration-700 
                    group-hover:scale-110"
        />
        
        {/* Badge status */}
        {!kamar.is_active && (
          <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-0.5 m-2 text-xs rounded-md">
            Not Available
          </div>
        )}
        
        {/* Rating overlay */}
        <div className="absolute top-0 left-0 m-2 bg-black/60 text-white rounded-md flex items-center px-2 py-1">
          <Star className="h-3 w-3 text-yellow-400 mr-1" fill="#facc15" />
          <span className="text-xs font-medium">{kamar.kategori_id === 'Premium' ? '4.9' : '4.5'}</span>
        </div>
      </div>
      
      {/* Informasi Kamar */}
      <div className="p-3 flex flex-col justify-between gap-2 flex-1">
        <div className="flex-1">
          {/* Header - Nama Kamar dan Badge */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-base font-bold text-gray-800 dark:text-white">
                {kamar.nama_kamar}
              </h2>
              <div className="flex items-center space-x-1 mt-1">
                <BadgeUI variant="primary" active={true}>
                  {kamar.kategori_id}
                </BadgeUI>
                <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
                <span className="text-sm text-gray-600 dark:text-gray-300">{formatPrice(kamar.price).replace('Rp', 'Rp ')} <span className="text-xs text-gray-500 dark:text-gray-400">per malam</span></span>
              </div>
            </div>
            
            {/* Action Buttons - hover reveal */}
            <div className="flex space-x-1 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
              <ActionButton 
                icon={<Info className="h-3 w-3" />}
                color="blue"
                onClick={handleOpenDetail}
                tooltip="Detail"
              />
              
              <ActionButton 
                icon={<Edit2 className="h-3 w-3" />}
                color="amber"
                onClick={() => {}}
                tooltip="Edit"
              />
              
              <ActionButton 
                icon={<Trash2 className="h-3 w-3" />}
                color="red"
                onClick={() => {}}
                tooltip="Delete"
              />
            </div>
          </div>
          
          {/* Features Badges */}
          <div className="flex flex-wrap gap-1 mt-2">
            {kamar.features?.slice(0, 4).map((feature, index) => (
              <BadgeUI key={index} variant="default" active={true}>
                {feature}
              </BadgeUI>
            ))}
            {kamar.features && kamar.features.length > 4 && (
              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                +{kamar.features.length - 4} more
              </span>
            )}
          </div>
        </div>

        <DetailKamarModals 
          isOpen={isDetailModalOpen} 
          onClose={handleCloseDetail} 
          title="Detail Kamar" 
        />
      </div>
    </div>
  );
}
