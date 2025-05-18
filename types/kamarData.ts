export interface KamarData {
    id?: number
    nama_kamar: string
    kategori_id?: number
    desk: string
    hotel_id?: number
    price: number
    is_kyc: boolean
    status: string
    images?: (File | string)[]
    features?: string[]
    is_active ?: boolean
    kategori? : string
    nama_hotel? : string
}

export interface detailDataKamar {
    id : number
    nama_kamar : string,
    harga_kamar : number,
    kategori_id : number,
    kategori : string,
    hotel_id : number,
    hotel : string,
    deskripsi : string,
    images : string[],
    is_active : boolean,
    status : string,
    features : string[],
}