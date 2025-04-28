import crypto from 'crypto';
import { env } from 'process';

export  const hashPassword = async (password: string) => {
    if (!env.KEY_HASHING) {
        throw new Error("HASH_SECRET is not defined in the environment variables.");
    }
    const hmacSha256 = crypto.createHmac('sha256', env.KEY_HASHING);
    hmacSha256.update(password);
    return hmacSha256.digest('hex');
}