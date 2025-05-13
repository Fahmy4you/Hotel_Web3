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
    onConfirm: (kategoriId: number) => Promise<void>;
    kategoriId: number;
    hotelName?: string;
    isLoading?: boolean;
}

export default function ConfirmDeleteKategoriModal({
    isOpen,
    onClose,
    onConfirm,
    kategoriId,
    hotelName,
    isLoading = false,
}: ConfirmDeleteKategoriModalProps) {
    const handleConfirm = async () => {
        if (!kategoriId) return;
        await onConfirm(kategoriId);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onClose} placement="center">
            <ModalContent>
                <ModalHeader>Konfirmasi Hapus Kategori</ModalHeader>
                <ModalBody>
                    <p>Apakah Anda yakin ingin menghapus kategori <strong>{hotelName}</strong>?</p>
                    <p className="text-sm text-gray-500">ID Kategori: {kategoriId}</p>
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
