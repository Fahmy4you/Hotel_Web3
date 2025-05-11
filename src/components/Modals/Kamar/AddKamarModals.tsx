import { ModalBody, ModalContent, ModalHeader, ModalFooter, Modal, Form } from '@heroui/react'
import React from 'react'

interface AddKamarModalsProps {
  isOpen: boolean,
  onClose: () => void,
}

const AddKamarModals = ({...props} : AddKamarModalsProps) => {
  return (
    <Modal placement='bottom' isOpen={props.isOpen} onClose={props.onClose}>
      <ModalContent>
        <ModalHeader>Tambah Kamar Baru</ModalHeader>
        <ModalBody>
         <Form>
          
         </Form>
        </ModalBody>
        <ModalFooter>

        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default AddKamarModals