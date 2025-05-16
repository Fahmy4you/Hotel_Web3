import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react"
import { ModalProps } from "../../../types/TypesPropModal"

const NotificationModal = ({isOpen, onClose} : ModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} backdrop="blur" scrollBehavior="inside">
        <ModalContent>
            <ModalHeader>Semua Notifikasi</ModalHeader>
            <ModalBody>Modal Body</ModalBody>
            <ModalFooter>
                <Button>Close</Button>
            </ModalFooter>
        </ModalContent>
    </Modal>
  )
}

export default NotificationModal