export default function generateRandomUserName(length = 6) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let userId = '';
    for (let i = 0; i < length; i++) {
      userId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `FKUSR${userId}`;
} 
  