import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react"
import { ModalProps } from "../../../types/TypesPropModal"

const ShowAllKategoriModal = ({isOpen, onClose} : ModalProps) => {
  return (
    <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
            <ModalHeader>Semua Kategori</ModalHeader>
            <ModalBody>
                Ini Adalah Body
            </ModalBody>
            <ModalFooter>
                <Button color="danger" variant="solid" onPress={onClose}>Close</Button>
            </ModalFooter>
        </ModalContent>
    </Modal>
  )
}

export default ShowAllKategoriModal