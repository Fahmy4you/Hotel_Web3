import jwt from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET

export const verifyToken = (token: string) => {
    try {
        if (!secretKey) {
            throw new Error("JWT_SECRET is not defined in the environment variables.");
        }
        return jwt.verify(token, secretKey);
    }
    catch (error) {
        console.error("Token verification failed:", error);
        return null;
    }
}