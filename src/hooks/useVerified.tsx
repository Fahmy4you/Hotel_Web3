'use client'

import { useEffect, useState } from "react"

type VerifiedData = {
    Email_verified: boolean;
    NoWa_verified: boolean;
};

export const useVerified = (userId: number) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [verifiedData, setVerifiedData] = useState<VerifiedData | null>(null);

    useEffect(() => {
        const fetchVerifiedStatus = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/me/verified/${userId}`);
                
                if (!response.ok) {
                    throw new Error(`Failed to fetch: ${response.status}`);
                }

                const data: VerifiedData = await response.json();
                console.log("data verifikasi : ", data);
                setVerifiedData(data);
            } catch (err) {
                console.error("Error in useVerified hook:", err);
                setError(err instanceof Error ? err.message : "Unknown error");
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchVerifiedStatus();
    }, [userId]);

    return { verifiedData, loading, error };
};