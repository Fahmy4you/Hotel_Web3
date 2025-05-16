export const formatDate = (date: Date): string => {
  return date
    .toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
    .replaceAll('/', ' - ');
}

export const tanggalSaja = (tanggal: Date) => {
  const d = new Date(tanggal);
  d.setHours(0, 0, 0, 0);
  return d;
}

export const checkTanggalBooking = (start: string, end: string) => {
    let today = new Date();
    let startDate =  new Date(start);
    let endDate =  new Date(end);

    today = tanggalSaja(today);
    startDate = tanggalSaja(startDate);
    endDate = tanggalSaja(endDate);

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

export const formatNominal = (value: number): string => {
  if (value >= 1_000_000_000_000) {
    return (value / 1_000_000_000_000).toFixed(0) + 'T';
  } else if (value >= 1_000_000_000) {
    return (value / 1_000_000_000).toFixed(0) + 'M';
  } else if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(0) + 'JT';
  } else if (value >= 100_000) {
    return (value / 1_000).toFixed(0) + 'K';
  } else {
    return value.toString();
  }
}

export const generateRandomString = (length: number) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const formatDate2 = (dateStr: string) => {
    const date = new Date(dateStr);
    const formatter = new Intl.DateTimeFormat("id-ID", {
        dateStyle: "medium"
    });
    return formatter.format(date);
}

export const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
}

export const potongText = (text: string, panjang: number) => {
    const isPanjang = text.length > panjang;
    const display = isPanjang ? text.slice(0, panjang) + "..." : text;

    return display;
}
