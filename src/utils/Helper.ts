export const formatDate = (date: Date) => date.toISOString().split('T')[0];

export const checkTanggalBooking = (start: string, end: string) => {
    const today = new Date();
    const todayString = formatDate(today);
    const startDate =  new Date(start);
    const endDate =  new Date(end);

    // Cek Apakah Tanggal Start Kurang Dari Sekarang
    if(startDate < today) {
        return "Tanggal checkin minimal hari ini";
    } else if(startDate == endDate) {
        return "Tanggal checkin tidak boleh sama dengan checkout";
    } else if(startDate >= endDate) {
        return "Tanggal checkout tidak boleh kurang atau sama dari hari checkin"
    }

    return "sukses";
}