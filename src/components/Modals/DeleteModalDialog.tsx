import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from "@heroui/react";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (id: number) => Promise<void>;
    ID: number | null;
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
    ID,
    title = "Konfirmasi Hapus",
    description = "Apakah Anda yakin ingin menghapus pengguna ini?",
    confirmText = "Ya, Hapus",
    cancelText = "Batal",
    isLoading = false,
}: ConfirmModalProps) {
    const handleConfirm = async () => {
         if (ID === null) return; 
        try {
            await onConfirm(ID);
        } catch(error){
            console.error("Gagal menghapus:", error);
            return;
        };
        onClose();
    }
    
    return (
        <Modal isOpen={isOpen} onOpenChange={onClose} placement="center">
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
                <ModalBody>
                    <p>{description}</p>
                    {ID && <p className="text-sm text-gray-500">ID : {ID}</p>}
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose} disabled={isLoading}>
                        {cancelText}
                    </Button>
                    <Button
                        className="bg-neutral-900 text-white dark:text-neutral-800 dark:bg-white dark:hover:bg-white-50"
                        variant="shadow"
                        onPress={handleConfirm}
                        isLoading={isLoading}
                        disabled={ID === null || isLoading}
                    >
                        {confirmText}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}