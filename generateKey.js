import crypto from 'crypto';

const stringKey = 'a-string-secret-at-least-256-bits-long';
const hashedKey = crypto.createHash('sha256').update(stringKey).digest('base64');
console.log("Hashed Secret Key (256-bits):", hashedKey);
