import { useSelector } from "react-redux";
import { RootState } from "../../../libs/store";
import Uploader from "../Uploader/UploaderFile";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from "@heroui/react";

type ModalProps = {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
};

export default function Modals({ isOpen, onOpenChange }: ModalProps) {
    const darkMode = useSelector((state: RootState) => state.theme.darkMode);

    return (
        <Modal
            radius="md"
            backdrop="blur"
            classNames={{
                body: `${darkMode ? 'bg-black-100 text-white-50' : 'bg-gray-100 text-gray-900'} transition-bg`,
                header: `${darkMode ? 'bg-black-100 text-white-50' : 'bg-gray-100 text-gray-900'} transition-bg`,
                footer: `${darkMode ? 'bg-black-100 text-white-50' : 'bg-gray-100 text-gray-900'} transition-bg`,
            }}
            isOpen={isOpen}
            placement="bottom-center"
            onOpenChange={onOpenChange}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Unggah foto profil baru</ModalHeader>
                        <ModalBody>
                            <Uploader />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Batal
                            </Button>
                            <Button color="secondary" onPress={onClose}>
                                Simpan
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
