"use client";
import { useState } from "react";
import { Input, DateRangePicker, Button, Form, Alert, Spinner } from '@heroui/react';
import { bookingSchema, BookingDataType } from "@/utils/zod";
import { DateValue } from '@react-types/calendar';
import { checkTanggalBooking, formatDate, formatRupiah } from "@/utils/Helper";
import { User } from "@prisma/client";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { Address, erc20Abi, parseUnits } from 'viem';
import { readContract, waitForTransactionReceipt } from "wagmi/actions";
import { getKamarById } from "@/app/Server/Kamar/Data/data";
import { deleteBooking, getBookingDataByKamarIdForCheck, createDataBooking } from "@/app/Server/Booking/data";
import { HOTEL_ADDRESS, IDRX_ADDRESS } from "@/utils/constanta";
import { liskSepolia } from "viem/chains";
import { HotelBookingAbi } from "@/utils/abi";
import { configXellar } from "@/utils/configXellar";

type RangeValue<T> = {
    start: T | null;
    end: T | null;
}

export interface informationSCType {
    transaksiID: number;
    nama_booking: string;
    user_id: number;
    nama_user: string;
    user_wallet: Address;
    hotel_id: number;
    hotel_nama: string;
    hotel_wallet: Address;
    kategori_nama: string;
    kamar_id: number;
    kamar_nama: string;
    transaksi_dibuat: string;
    check_in: string;
    check_out: string;
}

export const cetakInformasi = ({transaksiID, nama_booking, user_id, nama_user, user_wallet, hotel_id, hotel_nama, hotel_wallet, kategori_nama, kamar_id, kamar_nama, transaksi_dibuat, check_in, check_out}: informationSCType) => {
    return `{transaksi_id : ${transaksiID} nama_booking : ${nama_booking} user_id : ${user_id} nama_user : ${nama_user} user_wallet : ${user_wallet} hotel_id : ${hotel_id} hotel_nama : ${hotel_nama} hotel_wallet : ${hotel_wallet} kategori_nama : ${kategori_nama} kamar_id : ${kamar_id} kamar_nama : ${kamar_nama} transaksi_tgl : ${transaksi_dibuat} tanggal_checkin : ${check_in} tanggal_checkout : ${check_out}}`
}

const FormSubmitBooking = ({user, harga, detailBooking}: {user: User | null, harga: number, detailBooking: Awaited<ReturnType<typeof getKamarById>>}) => {
    const {address} = useAccount();
    const {writeContractAsync, isPending} = useWriteContract();
    const [errors, setErrors] = useState<Partial<Record<keyof BookingDataType, string>>>({});
    const [buttonVisible, setButtonVisible] = useState(false);
    const [total, setTotal] = useState(harga);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [errorSubmit, setErrorSubmit] = useState({
        title: '',
        desk: ''
    });
    const [suksesSubmit, setSuksesSubmit] = useState({
        title: '',
        desk: ''
    });

    const addBookingSC = async ({transaksiID, nama_booking, user_id, nama_user, user_wallet, hotel_id, hotel_nama, hotel_wallet, kategori_nama, kamar_id, kamar_nama, transaksi_dibuat, check_in, check_out}: informationSCType) => {
        const information = cetakInformasi({
            transaksiID,
            nama_booking,
            user_id,
            nama_user,
            user_wallet,
            hotel_id,
            hotel_nama,
            hotel_wallet,
            kategori_nama,
            kamar_id,
            kamar_nama,
            transaksi_dibuat,
            check_in,
            check_out
        });

        try {
            const hashBooked = await writeContractAsync({
                abi: HotelBookingAbi,
                address: HOTEL_ADDRESS,
                functionName: "addBookingData",
                args: [BigInt(transaksiID), information]
            })
    
            await waitForTransactionReceipt(configXellar, {
                hash: hashBooked,
                chainId: liskSepolia.id
            })

            return {sukses: true, message: "Transaksi Sudah Ditambahkan Ke Booking"}
        } catch(e) {
            console.log(e);
            return {sukses: false, message: "Transaksi Gagal Dilakukan"}
        }
    }

    const saveDataBlockChain = async () => {
        const idrx = parseUnits(total.toString(), 2);
        const addressHotel: Address = detailBooking?.hotel.user.wallet_address as Address;

        if(!isPending) {
            try {
                const hashApprove = await writeContractAsync({
                    abi: erc20Abi,
                    address: IDRX_ADDRESS,
                    functionName: "approve",
                    args: [HOTEL_ADDRESS, BigInt(idrx)]
                });
    
                await waitForTransactionReceipt(configXellar, {
                    hash: hashApprove,
                    chainId: liskSepolia.id
                });
    
                const idTransaksi = await readContract(configXellar, {
                    abi: HotelBookingAbi,
                    address: HOTEL_ADDRESS,
                    functionName: "getLengthTransaksi",
                    chainId: liskSepolia.id
                });

                const idNumber = Number(idTransaksi);
    
                if(typeof idNumber === "number" && !isNaN(idNumber) && idNumber >= 0) {
                    if(addressHotel) {
                        const hashTrans = await writeContractAsync({
                            abi: HotelBookingAbi,
                            address: HOTEL_ADDRESS,
                            functionName: "addTransaksi",
                            args: [addressHotel, BigInt(idrx)]
                        })

                        await waitForTransactionReceipt(configXellar, {
                            hash: hashTrans,
                            chainId: liskSepolia.id
                        })

                        return {sukses: true, data: idTransaksi}
                    } else {
                        return {sukses: false, message: "Address Hotel Tidak Tersedia"}
                    }
                } else {
                    return {sukses: false, message: "Id Transaksi Tidak Valid"}
                }
            } catch(e) {
                console.log(e)
                return {sukses: false, message: "Transaksi Gagal Dilakukan"}
            }

        } else {
            return {sukses: false, message: "Transaksi Anda Pending"}
        }
        
    }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorSubmit({
        title: '',
        desk: ''
    });
    setSuksesSubmit({
        title: '',
        desk: ''
    });
    const formData = new FormData(e.currentTarget);

    const data = {
        nama: formData.get('nama') as string,
        wa: formData.get('wa') as string,
        startDate: formData.get('startDate') as string,
        endDate: formData.get('endDate') as string,
    }

    const result = bookingSchema.safeParse(data);

    if(!result.success) {
        const formErrors: Partial<Record<keyof BookingDataType, string>> = {};
        result.error.errors.forEach((err) => {
            formErrors[err.path[0] as keyof BookingDataType] = err.message;
        });
        setErrors(formErrors);
        return;
    }

    setLoadingSubmit(true);
    if(detailBooking?.id && detailBooking?.hotel.id && user?.id && data.nama && data.wa && data.startDate && data.endDate) {
        const dataBooking = await getBookingDataByKamarIdForCheck(detailBooking.id);
        const isDateConflict = dataBooking.some((booking: {tanggal_checkin: Date, tanggal_checkout: Date}) => {
            const existingStart = new Date(booking.tanggal_checkin);
            const existingEnd = new Date(booking.tanggal_checkout);
            const newStart = new Date(data.startDate);
            const newEnd = new Date(data.endDate);

            return (
                (newStart >= existingStart && newStart <= existingEnd) ||
                (newEnd >= existingStart && newEnd <= existingEnd) ||
                (newStart <= existingStart && newEnd >= existingEnd)
            );
        });

        if(!isDateConflict) {
            const saveBlock = await saveDataBlockChain();
            if(saveBlock.sukses) {

                const saveDB = await createDataBooking(Number(saveBlock.data), detailBooking?.id, detailBooking?.hotel.id, user?.id, data.nama, data.wa, data.startDate, data.endDate, total);
                if(!saveDB.sukses) {
                    setErrorSubmit({
                        title: 'Gagal Booking',
                        desk: saveDB.message ?? "Tidak Diketahui, Hubungi Admin"
                    });
                } else {

                    const tanggalCheckin = new Date(data.startDate);
                    const checkKurangTigaHari = (tanggalCheckin.getTime() - Date.now() <= (3 * 24 * 60 * 1000));
                    if(checkKurangTigaHari) {
                        const tanggalCheckout = new Date(data.endDate);
                        const tanggalSekarang = new Date();

                        // Harusnya ada pengecekan jika gagal 
                        const dataBooking = await addBookingSC({
                            transaksiID: Number(saveBlock.data),
                            nama_booking: data.nama,
                            user_id: user.id,
                            nama_user: user.nama as string,
                            user_wallet: user.wallet_address as Address,
                            hotel_id: detailBooking.hotel.id,
                            hotel_nama: detailBooking.hotel.nama_hotel,
                            hotel_wallet: detailBooking.hotel.user.wallet_address as Address,
                            kategori_nama: detailBooking.kategori.kategori,
                            kamar_id: detailBooking.id,
                            kamar_nama: detailBooking.nama_kamar,
                            transaksi_dibuat: formatDate(tanggalSekarang),
                            check_in: formatDate(tanggalCheckin),
                            check_out: formatDate(tanggalCheckout)
                        });

                        if(!dataBooking.sukses) {
                            const deleteBookingRes = await deleteBooking(Number(saveBlock.data));

                            if(!deleteBookingRes.sukses) {
                                setErrorSubmit({
                                    title: 'Gagal Hapus Booking',
                                    desk: (deleteBookingRes?.message ?? 'Hapus Booking Gagal') + ", Lapor Admin"
                                });
                                return;
                            }

                            setErrorSubmit({
                                title: 'Gagal Booking',
                                desk: saveBlock?.message ?? 'Transaksi Gagal Dilakukan'
                            });
                            return;
                        }
                    }
                    
                    setSuksesSubmit({
                        title: 'Berhasil, Cek Data Transaksi Di Dashboard',
                        desk: 'Transaksi Berhasil Dengan ID : ' + Number(saveBlock.data)
                    });
                }
            } else {
                setErrorSubmit({
                    title: 'Gagal Booking',
                    desk: saveBlock?.message ?? 'Transaksi Gagal Dilakukan'
                });
            }
        } else {
            setErrorSubmit({
                title: 'Gagal Booking',
                desk: 'Kamar Ini Sudah Dibooking Di Tanggal Tersebut.'
            });
        }
    } else {
        setErrorSubmit({
            title: 'Gagal Booking',
            desk: 'Data Anda Tidak Lengkap, Hubungi Admin'
        });
    }

    setErrors({});
    setLoadingSubmit(false);
    setButtonVisible(false);
  };

  const handleChangeDate = (value: RangeValue<DateValue> | null) => {
    if (!value) return;
    if (!value.start && !value.end) return;

    const startDate = value.start?.toDate('Asia/Jakarta');
    const endDate = value.end?.toDate('Asia/Jakarta');

    const startDateString = startDate ? startDate.toString() : null;
    const endDateString = endDate ? endDate.toString() : null;

    let checkBooking = (startDateString && endDateString)
        ? checkTanggalBooking(startDateString, endDateString)
        : "Gagal proses tanggal anda, masukkan kembali atau hubungi admin";

    if (checkBooking === "sukses") {
        if (user && address) {
            if (user.no_wa && user.wallet_address && user.email) {
                // Hitung jumlah hari
                if (startDate && endDate) {
                    const diffInMs = endDate.getTime() - startDate.getTime();
                    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
                    const totalHarga = diffInDays * harga;
                    setTotal(totalHarga); 
                    setButtonVisible(true);
                    return;
                } else {
                    checkBooking = "Start dan End Date Kosong";
                    setErrors({ startDate: checkBooking });
                }

                } else {
                    checkBooking = "Profile Anda Tidak Lengkap";
                    setErrors({ startDate: checkBooking });
                }
            } else {
                checkBooking = "Anda Belum Login";
                setErrors({ startDate: checkBooking });
            }
        } else {
            setErrors({ startDate: checkBooking });
        }

        setButtonVisible(false);
        return;
    }



    if(!loadingSubmit) {
        return (
          <Form className='w-full space-y-3' validationErrors={errors} onSubmit={onSubmit}>
            {(errorSubmit.title != '' && errorSubmit.desk != '') && <Alert color="danger" classNames={{description: ['text-[12px]']}} title={errorSubmit.title} description={errorSubmit.desk} />}
            {(suksesSubmit.title != '' && suksesSubmit.desk != '') && <Alert color="success" classNames={{description: ['text-[12px]']}} title={suksesSubmit.title} description={suksesSubmit.desk} />}
              <Input 
                  autoFocus 
                  label="Nama Booking" 
                  name="nama" 
                  type="text" 
                  placeholder="Masukkan Nama Booking Anda" 
                  variant="underlined" 
                  classNames={{inputWrapper: "shadow-[0_1px_0px_0_rgba(5,5,5,0.4)] dark:shadow-[0_1px_0px_0_rgba(255,255,255,0.4)]"}}
                  errorMessage={errors.nama}/>
              <Input 
                  label="No. Whatsapp" 
                  name="wa"
                  type="text" 
                  placeholder="Nomor Telepon Cadangan Anda" 
                  variant="underlined" 
                  id="wa"
                  classNames={{inputWrapper: "shadow-[0_1px_0px_0_rgba(5,5,5,0.4)] dark:shadow-[0_1px_0px_0_rgba(255,255,255,0.4)]"}}
                  errorMessage={errors.wa}/>
              <DateRangePicker 
                  label="Tanggal Checkin - Checkout"
                  startName="startDate"
                  endName="endDate"
                  errorMessage={errors.startDate}
                  onChange={handleChangeDate}
                  description="Pilih rentang tanggal yang benar maka tombol booking akan muncul"
                  variant="underlined" 
                  id="daterange"
                  classNames={{inputWrapper: "shadow-[0_1px_0px_0_rgba(5,5,5,0.4)] dark:shadow-[0_1px_0px_0_rgba(255,255,255,0.4)]"}}/>
              
              {buttonVisible && (
                  <Button type='submit' variant='bordered' className='w-full mt-2'>{formatRupiah(total)} Booking Sekarang</Button>
              )}
          </Form>
        )
    } else {
        return (
            <div className="flex w-full h-full justify-center items-center">
                <Spinner color="primary" classNames={{dots: ['bg-gray-900', 'dark:bg-white-50']}} variant="wave" label="Memproses Data..."/>
            </div>
        )
    }
}

export default FormSubmitBooking
