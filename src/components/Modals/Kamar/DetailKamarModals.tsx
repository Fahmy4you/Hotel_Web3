import CarouselUI from '@/components/AtomsComponent/CarrouselUI';
import { Modal, ModalContent, ModalFooter, ModalHeader, ModalBody, Button, Chip, Skeleton } from '@heroui/react';
import React, { useEffect } from 'react';
import { formatRupiah } from '@/utils/RupiahFormater';
import { useManageKamar } from '@/hooks/useManageKamar';
import { useHooksUser } from '@/hooks/useHooksUser';
import { parseFeatures } from '@/utils/parseFeatures';
import LoadingDetailKamar from '@/components/WhileLoading/LoadingDetailKamar';

interface DetailKamarProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  selectedIdKamar?: number | null;
}

const DetailKamarModals = ({ title, isOpen, onClose, selectedIdKamar }: DetailKamarProps) => {
  const { user } = useHooksUser();
  const { getDetailKamar, detailDataKamar, isLoading } = useManageKamar(user?.id || 0);
  
  const features = parseFeatures(detailDataKamar?.features || []);
  const roomImages = detailDataKamar?.images?.length 
    ? detailDataKamar.images.map(img => 
        typeof img === 'string' 
          ? `/uploads/kamars/${img}` 
          : '/image/empty-image.png'
      )
    : ['/image/empty-image.png'];

  useEffect(() => {
    if (selectedIdKamar && isOpen) {
      getDetailKamar(selectedIdKamar);
    }
  }, [selectedIdKamar, isOpen, getDetailKamar]);
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl" scrollBehavior="inside">
      {isLoading ? <LoadingDetailKamar /> : (
        <ModalContent className="overflow-hidden">
          <ModalHeader className="border-b pb-3 border-neutral-700">
            <div className="flex justify-between gap-3 items-center">
              <h2 className="text-xl font-bold">{detailDataKamar?.nama_kamar || title}</h2>
              <Chip color="primary" variant="flat">
                {detailDataKamar?.status || 'Available'}
              </Chip>
            </div>
          </ModalHeader>
          
          <ModalBody className="px-0 pt-0">
            {/* Image Section */}
            <div className="relative w-full mb-4">
              {roomImages.length > 1 ? (
                <CarouselUI images={roomImages} />
              ) : (
                <div className="w-full h-64 sm:h-80">
                  <img 
                    src={roomImages[0]} 
                    alt={`${detailDataKamar?.nama_kamar || title} view`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/image/empty-image.png';
                    }}
                  />
                </div>
              )}
            </div>
            
            {/* Content Section */}
            <div className="px-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">
                    {formatRupiah(detailDataKamar?.harga_kamar || 0)}
                  </h3>
                  <p className="text-sm text-gray-500">per night</p>
                </div>
                
                <div className="mt-2 sm:mt-0">
                  <Chip
                    classNames={{
                      base: "dark:bg-gray-100 bg-neutral-800",
                      content: "dark:text-neutral-900 text-white",
                    }}
                    radius="sm" 
                    variant="solid" 
                    className="text-lg"
                  >
                    {detailDataKamar?.nama_kamar || 'No room name'}
                  </Chip>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 dark:bg-neutral-800 p-3 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Hotel</p>
                  <p className="font-medium">{detailDataKamar?.hotel || 'No hotel specified'}</p>
                </div>
                
                <div className="bg-gray-50 dark:bg-neutral-800 p-3 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Category</p>
                  <p className="font-medium">{detailDataKamar?.kategori || 'No category specified'}</p>
                </div>
              </div>
              
              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {detailDataKamar?.deskripsi || 'No description available'}
                </p>
              </div>
              
              {/* Amenities */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {features.slice(0, 4).map((feature, index) => (
                    <Chip 
                      key={index}
                      color="primary"
                      variant="shadow"
                      className="text-xs py-1 px-2"
                    >
                      {feature}
                    </Chip>
                  ))}
                  {features.length > 4 && (
                    <Chip 
                      color="primary"
                      variant="shadow"
                      className="text-xs py-1 px-2"
                    >
                      +{features.length - 4} More
                    </Chip>
                  )}
                </div>
              </div>
            </div>
          </ModalBody>
          
          <ModalFooter className="border-t border-neutral-700">
            <Button 
              className="dark:bg-white w-24 text-medium font-semibold bg-neutral-900 text-white dark:text-neutral-900" 
              variant="solid" 
              onPress={onClose}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      )}
    </Modal>
  );
};

export default DetailKamarModals;