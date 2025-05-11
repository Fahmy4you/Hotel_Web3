"use client";
import { useState } from "react";
import { Input, DateRangePicker, Button, Form } from '@heroui/react';
import { bookingSchema, BookingDataType } from "@/utils/zod";
import { DateValue } from '@react-types/calendar';
import { checkTanggalBooking } from "@/utils/Helper";
type RangeValue<T> = {
    start: T | null;
    end: T | null;
}
  


const FormSubmitBooking = () => {
    const [errors, setErrors] = useState<Partial<Record<keyof BookingDataType, string>>>({});
    const [submitted, setSubmitted] = useState<BookingDataType>({
        nama: "",
        wa: "",
        startDate: "",
        endDate: ""
    });
    const [buttonVisible, setButtonVisible] = useState(false);


  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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

    setErrors({});
    setSubmitted(result.data)
  };

  const handleChangeDate = (value: RangeValue<DateValue> | null) => {
    if(!value) return;
    if(!value.start && !value.end) return;
    const startDateString = value.start ? value.start.toString() : null;
    const endDateString = value.end ? value.end.toString() : null;
    const checkBooking = (startDateString && endDateString) ? checkTanggalBooking(startDateString, endDateString) : "Gagal proses tanggal anda, masukkan kembali atau hubungi admin";

    if(checkBooking == "sukses") {
        setButtonVisible(true);
    } else {
        setErrors({startDate: checkBooking});
    }

  }


  return (
    <Form className='w-full space-y-4' validationErrors={errors} onSubmit={onSubmit}>
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
            <Button type='submit' variant='bordered' className='w-full mt-2'>Booking Sekarang</Button>
        )}
    </Form>
  )
}

export default FormSubmitBooking
