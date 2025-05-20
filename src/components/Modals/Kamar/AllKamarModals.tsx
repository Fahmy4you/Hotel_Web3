import { Button, Modal,
     ModalBody,
      ModalContent,
       ModalFooter,
        ModalHeader,
         Select,
          SelectItem
         } from '@heroui/react'
import CardListKamar from '@/components/Card/CardListKamar';
import { RootState } from '../../../../libs/store';
import { useSelector } from 'react-redux';
import { useManageKamar } from '@/hooks/useManageKamar';
import { typeResponseListKamar } from '@/components/Card/CardListKamar';
import { ModalProps } from '../../../types/TypesPropModal';

const AllKamarModals = ({isOpen, onClose} : ModalProps) => {
    const userId = useSelector((state: RootState) => state.users.id) || 0;
    const {kamars} = useManageKamar(userId);
  return (
    <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
        <ModalContent className="w-full p-2">
            <ModalHeader className="w-full">
                <div className='flex w-full items-center justify-between'>
                    <h1 className='text-lg '>
                List Kamar
                    </h1>
                <Select selectedKeys={'all'} size='sm' className='w-[200px]'>
                    <SelectItem>All</SelectItem>
                </Select>
                </div>
            </ModalHeader>
            <ModalBody>
                {kamars.map((kamar) => (
                    <CardListKamar
                    key={kamar.id} kamar={kamar as typeResponseListKamar}/>
                ))}
            </ModalBody>
            <ModalFooter>
               <Button color="danger" variant="solid" onPress={onClose}>Close</Button>
            </ModalFooter>
        </ModalContent>
    </Modal>
  )
}

export default AllKamarModals