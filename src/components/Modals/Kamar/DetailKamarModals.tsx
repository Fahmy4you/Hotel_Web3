import CarouselUI from '@/components/AtomsComponent/CarrouselUI'
import { Modal, ModalContent, ModalFooter, ModalHeader, ModalBody } from '@heroui/react'
import React from 'react'
import { KamarData } from '../../../../types/kamarData'


interface detailKamarProps{
    title : string
    isOpen : boolean
    onClose : () => void
    // initialData : any
}

const DetailKamarModals = ({...props} : detailKamarProps) => {
  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}> 
        <ModalContent>
            <ModalHeader>
                {props.title}
            </ModalHeader>
            <ModalBody>
                <CarouselUI/>
                <h1>Test Modal Detail</h1>
                <div>
                    deskripsi
                </div>
            </ModalBody>
            <ModalFooter>

            </ModalFooter>
        </ModalContent>
    </Modal>
  )
}

export default DetailKamarModals