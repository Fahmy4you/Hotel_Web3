'use client';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openModals, closeModals } from '../../../libs/slices/modalSlice';
import { Info, Edit2, Trash2, Coffee, Tag, Home } from 'lucide-react';
import type { RootState } from '../../../libs/store';
import { ActionButton } from '../Button/ActionButton';
import DetailKamarModals from '../Modals/Kamar/DetailKamarModals';
import type { KamarData } from '../../../types/kamarData';
import { formatRupiah } from '@/utils/RupiahFormater';
import { parseFeatures } from '@/utils/parseFeatures';
import { Chip, addToast } from '@heroui/react';
import { useManageKamar } from '@/hooks/useManageKamar';
import ConfirmModal from '../Modals/DeleteModalDialog';
import EditKamarModal from '../Modals/Kamar/EditKamarModal';

interface KamarCardProps {
  kamar: KamarData;
}

export default function KamarCard({ kamar }: KamarCardProps) {
  const dispatch = useDispatch();
  const modal = useSelector((state: RootState) => state.modals);
  const { deleteKamar, isLoading } = useManageKamar(kamar.id || 0);
  const [selectedKamar, setSelectedKamar] = useState<number | null>(null);
  const [currentImageIndex] = useState(0);

  const handleOpenDetail = () => {
    setSelectedKamar(kamar.id ?? null);
    dispatch(openModals('detail'));
  };

  const handleCloseDetail = () => {
    dispatch(closeModals('detail'));
  };

  const handleDeleteInit = (id: number) => {
    setSelectedKamar(id);
    dispatch(openModals('delete'));
  };

  const handleEdit = () => {
    setSelectedKamar(kamar.id ?? null);
    dispatch(openModals('edit'));
  }

  const confirmDeleteKamar = async () => {
    if (selectedKamar === null) {
      addToast({
        title: 'Debug For Development',
        description: 'Id kamar null',
        variant: 'flat',
        color: 'danger',
      })
    };
    
    try {
        await deleteKamar(selectedKamar as number);
    } catch (error) {
        console.error("Gagal menghapus kamar:", error);
    } finally {
        dispatch(closeModals('delete'));
    }
};

  const features = parseFeatures(kamar.features);
  const formattedPrice = formatRupiah(kamar.price);

  return (
    <div className="group relative w-full md:w-96 bg-white dark:bg-neutral-800 rounded-xl shadow-md overflow-hidden border border-slate-200 dark:border-neutral-700 transition-all duration-300 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600">
      
      {/* Status Badge */}
      {!kamar.is_active && (
        <div className="absolute top-3 right-3 z-10 bg-red-500 text-white px-2 py-1 text-xs font-medium rounded-full shadow-md">
          Tidak Aktif
        </div>
      )}
      
      {/* Room Image */}
      <div className="relative w-full h-48 overflow-hidden">
        <img
          src={getImageUrl(kamar, currentImageIndex)}
          alt={kamar.nama_kamar}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = '/default-room-image.jpg';
          }}
        />
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          <span className="text-white text-lg font-bold flex items-center">
            <span className="text-sm mr-1.5 text-gray-200">Harga:</span>
            {formattedPrice}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
              {kamar.nama_kamar}
            </h2>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-1">
              <Home className="h-3.5 w-3.5 mr-1" />
              {kamar.nama_hotel}
            </div>
          </div>
          
          <div className="flex space-x-1.5">
            <ActionButton 
              icon={<Info size={16} />} 
              color="blue" 
              onClick={handleOpenDetail} 
              tooltip="Detail"
            />
            <ActionButton 
              icon={<Edit2 size={16} />} 
              color="amber" 
              onClick={handleEdit} 
              tooltip="Edit"
            />
            <ActionButton 
              icon={<Trash2 size={16} />} 
              color="red"
              onClick={() => kamar.id && handleDeleteInit(kamar.id)}
              tooltip="Delete"
            />
          </div>
        </div>
        
        <div className="mb-5">
          <div className="flex items-center mb-2">
            <Tag className="h-3.5 w-3.5 mr-1 text-indigo-600 dark:text-indigo-500" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Kategori Kamar:
            </span>
          </div>
          <Chip size="sm" radius="sm" color="secondary" variant="shadow" className="text-sm py-1 px-3 font-medium">
            {kamar.kategori}
          </Chip>
        </div>
        
        <div className="mt-3">
          <div className="flex items-center mb-2">
            <Coffee className="h-3.5 w-3.5 mr-1 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Fasilitas Kamar:
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {features.slice(0, 4).map((feature, index) => (
              <Chip
                size="sm"
                radius="sm"
                color="success"
                variant="flat"
                className="text-sm py-1 px-3 font-medium"
                key={index}
              >
                {feature}
              </Chip>
            ))}
            {features.length > 4 && (
              <Chip
                size="sm"
                radius="sm"
                color="success"
                variant="flat"
                className="text-sm py-1 px-3 font-medium"
              >
                +{features.length - 4} lainnya
              </Chip>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <DetailKamarModals 
        isOpen={modal.detail} 
        onClose={handleCloseDetail} 
        title="Detail Kamar"
        selectedIdKamar={selectedKamar}
      />

      <ConfirmModal
    isOpen={modal.delete}
    onClose={() => {
        setSelectedKamar(null);
        dispatch(closeModals('delete'));
    }}
    onConfirm={confirmDeleteKamar}
    ID={selectedKamar}
    isLoading={isLoading}
    title="Konfirmasi Hapus Kamar"
    description="Apakah Anda yakin ingin menghapus kamar ini?"
/>

<EditKamarModal selectedIdKamar={selectedKamar} isOpen={modal.edit} onClose={() => dispatch(closeModals('edit'))} />
    </div>
  );
}

// Helper function with improved type safety
function getImageUrl(kamar: KamarData, index: number): string {
  if (!kamar.images?.length) return '/default-room-image.jpg';

  try {
    const image = kamar.images[index] ?? kamar.images[0];
    
    if (typeof image === 'string') {
      if (image.startsWith('http')) return image;
      
      const filename = image.split('/').pop() ?? '';
      return `/uploads/kamars/${filename}`;
    }

    if (image instanceof File) {
      return URL.createObjectURL(image);
    }
  } catch (error) {
    console.error('Error processing image:', error);
  }

  return '/default-room-image.jpg';
}