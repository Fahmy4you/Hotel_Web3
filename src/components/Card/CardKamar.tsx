'use client';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openModals, closeModals } from '../../../libs/slices/modalSlice';
import { Info, Edit2, Trash2 } from 'lucide-react';
import BadgeUI from '@/components/AtomsComponent/BadgeUI';
import { RootState } from '../../../libs/store';
import { ActionButton } from '../Button/ActionButton';
import DetailKamarModals from '../Modals/Kamar/DetailKamarModals';
import { KamarData } from '../../../types/kamarData';
import { formatRupiah } from '@/utils/RupiahFormater';
import { parseFeatures } from '@/utils/parseFeatures';

interface KamarCardProps {
  kamar: KamarData;
}

export default function KamarCard({ kamar }: KamarCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const dispatch = useDispatch();
  const { detail: isDetailModalOpen } = useSelector((state: RootState) => state.modals);

  const handleOpenDetail = () => dispatch(openModals('detail'));
  const handleCloseDetail = () => dispatch(closeModals('detail'));

  const imageUrl = getImageUrl(kamar, currentImageIndex);
  const features = parseFeatures(kamar.features);
  const formattedPrice = formatRupiah(kamar.price);

  return (
    <div className="group lg:w-2/5 w-full bg-gradient-to-r from-slate-50 to-slate-100 dark:from-neutral-900 dark:to-neutral-800 
      rounded-lg shadow-sm overflow-hidden border border-slate-200 dark:border-neutral-700
      transform transition-all duration-200 hover:shadow-md
      dark:hover:shadow-blue-900/10 hover:shadow-blue-200/30 flex h-[175px]">
      
      {/* Gambar Kamar */}
      <div className="relative w-[155px] mt-1 ms-1 p-2 h-[165px] overflow-hidden">
        <img
          src={imageUrl}
          alt={kamar.nama_kamar}
          className="w-full h-full rounded-lg object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {!kamar.is_active && (
          <div className="absolute bottom-0 right-0 bg-red-500 text-white px-1 py-0.5 m-1 text-xs rounded-md">
            NA
          </div>
        )}
      </div>

      {/* Informasi */}
      <div className="px-2 py-1.5 flex flex-col justify-between flex-1">
        <div className="flex justify-between items-start">
          <div className="flex flex-col justify-between items-start ps-0 lg:ps-3">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white truncate">
              {kamar.nama_kamar}
            </h2>

            {/* Nama hotel mobile vs desktop */}
            <p className="text-xs text-gray-600 dark:text-gray-400 md:hidden">
              {((kamar.nama_hotel ?? '').length > 20
                ? (kamar.nama_hotel ?? '').slice(0, 20) + '...'
                : kamar.nama_hotel) ?? ''}
            </p>
            <p className="md:text-sm text-gray-600 dark:text-gray-400 hidden md:block">
              {kamar.nama_hotel}
            </p>

            <div className="flex flex-col-reverse gap-2">
              <BadgeUI variant="primary" active className="text-xs max-sm:text-[11px] py-0 px-1.5">
                {kamar.kategori}
              </BadgeUI>
              <span className="md:text-md font-semibold text-gray-600 dark:text-gray-300">
                {formattedPrice}
              </span>
            </div>
          </div>

          <div className="flex space-x-1 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
            <ActionButton icon={<Info className="h-3 w-3" />} color="blue" onClick={handleOpenDetail} tooltip="Detail" />
            <ActionButton icon={<Edit2 className="h-3 w-3" />} color="amber" onClick={() => {}} tooltip="Edit" />
            <ActionButton icon={<Trash2 className="h-3 w-3" />} color="red" onClick={() => {}} tooltip="Delete" />
          </div>
        </div>

        <div className="flex lg:mb-4 mb-1 ps-0 lg:ps-3 flex-wrap gap-1">
          {features.slice(0, 3).map((feature, index) => (
            <BadgeUI key={index} variant="default" active className="text-xs py-0 px-1.5">
              {feature}
            </BadgeUI>
          ))}
          {features.length > 3 && (
            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
              +{features.length - 3} more
            </span>
          )}
        </div>
      </div>

      <DetailKamarModals isOpen={isDetailModalOpen} onClose={handleCloseDetail} title="Detail Kamar" />
    </div>
  );
}

// === Helper Functions ===
function getImageUrl(kamar: KamarData, index: number): string {
  if (!kamar.images || kamar.images.length === 0) return '/default-room-image.jpg';

  const currentImage = Array.isArray(kamar.images) ? kamar.images[index] : kamar.images;

  if (currentImage instanceof File) {
    return URL.createObjectURL(currentImage);
  }

  if (typeof currentImage === 'string') {
    const cleanPath = currentImage.replace(/[{}]/g, '').replace(/^\/+/, '');

    if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://')) {
      return cleanPath;
    }

    const filename = cleanPath.split('/').pop();
    return `/uploads/kamars/${filename}`;
  }

  return '/default-room-image.jpg';
}

