export const parseField = (field: any): any[] => {
  if (typeof field === 'string') {
    try {
      return JSON.parse(field);
    } catch (e) {
      return [field]; // Jika bukan JSON, kembalikan array
    }
  } else if (Array.isArray(field)) {
    // Jika sudah array, cek apakah ada elemen string JSON
    return field.map(item => {
      if (typeof item === 'string') {
        try {
          return JSON.parse(item);
        } catch (e) {
          return item;
        }
      }
      return item;
    }).flat(); // Biar rata kalo nested array
  }
  return [field];
};