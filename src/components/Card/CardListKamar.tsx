import { FaBed } from "react-icons/fa6";
import BadgeUI from '../AtomsComponent/BadgeUI';
import { StatusKamar } from '@prisma/client';

export interface typeResponseListKamar {
    id: number;
    nama_kamar: string;
    nama_hotel: string;
    status: StatusKamar;
}

interface CardListKamarProps {
    kamar: typeResponseListKamar;
    className?: string
}
const CardListKamar = ({ kamar, className = '' }: CardListKamarProps) => {
    return (
        <div key={kamar.id} className={`${className} flex items-center justify-between p-3 dark:bg-neutral-800 bg-gray-50 rounded-lg hover:bg-gray-100`}>
            <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-lg border border-gray-200">
                    <FaBed size={18} className="text-gray-600" />
                </div>
                <div>
                    <p className="font-medium">{kamar.nama_kamar}</p>
                    <p className="text-xs text-gray-500">{kamar.nama_hotel}</p>
                </div>
            </div>
            <BadgeUI variant={kamar.status ? 'success' : 'error'}>
                {kamar.status}
            </BadgeUI>
        </div>
    )
}

export default CardListKamar