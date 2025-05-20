export interface UserData {
    id?: number;
    nama: string;
    wallet_address: string;
    no_wa: string;
}


export interface TypeGetMe {
  id?: number;
  wallet_address?: string;
  role_id?: number;
  role?: string;
  profile_pict?: string;
  nama_user?: string;
  email?: string;
  join_date?: Date;
  no_wa?: string;
}