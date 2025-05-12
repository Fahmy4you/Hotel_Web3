import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  RadioGroup,
  select
} from '@heroui/react';
import { useManageHotel } from '@/hooks/useManageHotel';
import React, { useState } from 'react';
import RadioCard from '@/components/Card/RadioCard';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../libs/store';
import { HotelData } from '../../../../types/hotelData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAction?: () => void;
  onSelectHotel?: (hotelData: HotelData | null) => void;
}

const FilterModals: React.FC<Props> = ({ isOpen, onClose, onAction, onSelectHotel }) => {
  const user_id = useSelector((state: RootState) => state.users.id) || 0;
  const [valueFilter, setValueFilter] = useState<HotelData | null>(null);
  const {hotels} = useManageHotel(user_id);


  const handleValueChange = (value: string) => {
    const selectedHotel = hotels.find(hotel => hotel.nama_hotel === value) || null;
    setValueFilter(selectedHotel);
    if (onSelectHotel && selectedHotel) {
      onSelectHotel(selectedHotel);
    }
  };

  const handleClearFilter = () => {
    setValueFilter(null);
    if (onSelectHotel) {
      onSelectHotel(null);
    }
  }

  return (
    <Modal
      backdrop="blur"
      scrollBehavior="inside"
      size="3xl"
      placement="bottom"
      isOpen={isOpen}
      onOpenChange={onClose}
    >
      <ModalContent>
        {(onClose) => (
          <>
             <ModalHeader>Filter Hotel</ModalHeader> 
            <ModalBody>
              <RadioGroup
                label="Pilih Hotel"
                orientation="vertical"
                value={valueFilter?.nama_hotel ?? ''}
                onValueChange={handleValueChange}
                className="flex flex-col gap-3"
              >
                {hotels.length === 0 && <div>Tidak ada hotel, Silahkan Tambahkan Hotel Terlebih dahulu</div>}
                {hotels.map((option) => (
                  <RadioCard
                    key={option.id}
                    value={option.nama_hotel}
                    title={option.nama_hotel}
                    description={option.lokasi}
                    isSelected={valueFilter === option}
                  />
                ))}
              </RadioGroup>
            </ModalBody>
            <ModalFooter>
              {valueFilter ?  <Button color="danger" variant="flat" onPress={handleClearFilter}>
                Hapus Filter
              </Button> :  <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>}
              {/* <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button> */}
              <Button color="primary" onPress={onAction || onClose}>
                Action
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default FilterModals;
