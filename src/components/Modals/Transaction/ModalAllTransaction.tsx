import { ModalProps } from '@/types/TypesPropModal'
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react'
import React from 'react'

const ModalAllTransaction = ({isOpen, onClose} : ModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
            <ModalHeader>Semua Transaksi</ModalHeader>
            <ModalBody>
                Ini Bodynya
            </ModalBody>
            <ModalFooter>
                <Button onPress={onClose}>Tutup</Button>
            </ModalFooter>
        </ModalContent>
    </Modal>
  )
}

export default ModalAllTransaction