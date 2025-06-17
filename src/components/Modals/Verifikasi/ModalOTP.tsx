import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react'
import React from 'react'

interface ModalProps {
    isOpen : boolean,
    onClose : () => void
}

const ModalOTP = ({
    isOpen,
    onClose
} : ModalProps) => {
  return (
   <Modal isOpen={isOpen} onClose={onClose}>
    <ModalContent>
        <ModalHeader>Modal Header</ModalHeader>
        <ModalBody>
            Modal Untuk OTP
        </ModalBody>
        <ModalFooter>
            <Button>Close</Button>
        </ModalFooter>
    </ModalContent>
   </Modal>

  )
}

export default ModalOTP