import { Addresses } from 'next/dist/build/turborepo-access-trace/types';
import { Address } from 'viem';

export enum StatusTransaksi {PROSES, SUKSES, BATAL};

export interface HotelBookingData {
    walletProses: Address;
    information: string;
}

export interface TransaksiData {
    idTransaksi: number,
    walletAddress: Address,
    walletHotel: Addresses,
    nominal: string,
    status: StatusTransaksi;
}

export interface Investor {
    wallet_id: Address,
    totalInvest: number
}
