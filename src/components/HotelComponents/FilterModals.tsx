import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  RadioGroup
} from '@heroui/react';
import { useManageHotel } from '@/hooks/useManageHotel';
import React, { useState } from 'react';
import RadioCard from './RadioCard';
import { useSelector } from 'react-redux';
import { roomOptions } from '@/app/Dumy/DumyDataForTesting';
import { RootState } from '../../../libs/store';
import { HotelData } from '../../../types/hotelData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAction?: () => void;
  onSelectHotel?: (hotelData: HotelData) => void;
}

const FilterModals: React.FC<Props> = ({ isOpen, onClose, onAction, onSelectHotel }) => {
    const user_id = useSelector((state: RootState) => state.users.id) || 0;
  const [roomType, setRoomType] = useState<HotelData | null>(null);
  const {hotels} = useManageHotel(user_id);

  const handleValueChange = (value: string) => {
    const selectedHotel = hotels.find(hotel => hotel.nama_hotel === value) || null;
    setRoomType(selectedHotel);
    if (onSelectHotel && selectedHotel) {
      onSelectHotel(selectedHotel);
    }
  };

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
                value={roomType?.nama_hotel}
                onValueChange={handleValueChange}
                className="flex flex-col gap-3"
              >
                {hotels.map((option) => (
                  <RadioCard
                    key={option.id}
                    value={option.nama_hotel}
                    title={option.nama_hotel}
                    description={option.desk}
                    isSelected={roomType === option}
                  />
                ))}
              </RadioGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
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
