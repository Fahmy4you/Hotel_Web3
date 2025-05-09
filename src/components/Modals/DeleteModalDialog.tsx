import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from "@heroui/react";
import { useState } from "react";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (id: number) => Promise<void>;
    userId: number;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
}

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    userId,
    title = "Konfirmasi Hapus",
    description = "Apakah Anda yakin ingin menghapus pengguna ini?",
    confirmText = "Ya, Hapus",
    cancelText = "Batal",
    isLoading = false,
}: ConfirmModalProps) {
    // const [isLoading, setIsLoading] = useState(false);

    const handleConfirm = async () => {
        if (!userId) return;

        //   setIsLoading(true);
        try {
            await onConfirm(userId);
        } finally {
            // setIsLoading(false);
            onClose();
        }
    };
    
    return (
        <Modal isOpen={isOpen} onOpenChange={onClose} placement="center">
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
                <ModalBody>
                    <p>{description}</p>
                    {userId && <p className="text-sm text-gray-500">ID Pengguna: {userId}</p>}
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose} disabled={isLoading}>
                        {cancelText}
                    </Button>
                    <Button
                        color="primary"
                        onPress={handleConfirm}
                        isLoading={isLoading}
                        disabled={!userId || isLoading}
                    >
                        {confirmText}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}