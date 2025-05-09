import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from "@heroui/react";

interface ConfirmDeleteKategoriModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (hotelId: number) => Promise<void>;
    hotelId: number;
    hotelName?: string;
    isLoading?: boolean;
}

export default function ConfirmDeleteKategoriModal({
    isOpen,
    onClose,
    onConfirm,
    hotelId,
    hotelName,
    isLoading = false,
}: ConfirmDeleteKategoriModalProps) {
    const handleConfirm = async () => {
        if (!hotelId) return;
        await onConfirm(hotelId);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onClose} placement="center">
            <ModalContent>
                <ModalHeader>Konfirmasi Hapus Hotel</ModalHeader>
                <ModalBody>
                    <p>Apakah Anda yakin ingin menghapus hotel <strong>{hotelName}</strong>?</p>
                    <p className="text-sm text-gray-500">ID Hotel: {hotelId}</p>
                </ModalBody>
                <ModalFooter>
                    <Button variant="light" onPress={onClose} disabled={isLoading}>
                        Batal
                    </Button>
                    <Button
                        color="danger"
                        onPress={handleConfirm}
                        isLoading={isLoading}
                        disabled={isLoading}
                    >
                        Ya, Hapus
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
