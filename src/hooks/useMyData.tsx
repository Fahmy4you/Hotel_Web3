'use client'
import { getMyTransactions } from "@/app/Server/Transaction/GetMyTransactions";
import { getIncome } from "@/app/Server/Transaction/owner/GetIncome";
import { getMyHotelsTransaction } from "@/app/Server/Transaction/owner/GetMyHotelsTransaction";
import { bookingData, incomeTypes } from "@/types/bookingData";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";


export const useMyData = (userID: number) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [query, setQuery] = useState("");
    const [DebounceQuery] = useDebounce(query, 500);
    const [transactions, setTransactions] = useState<bookingData[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [revenueData, setRevenueData] = useState<{ name: string; revenue: number | null; }[]>([]);
    const itemPerPage = 10;

    // Region Get My Transaction
    const getMyTransaction = useCallback(async () => {
        if (!userID || userID <= 0) return;

        setLoading(true);
        try {
            const res = await getMyTransactions({
                page: currentPage,
                user_id: userID,
                query: DebounceQuery
            });
            setTransactions(res.data);
            setTotalPages(res.totalPages);
            setTotalItems(res.totalData);
        } catch (error) {
            console.error('Error:', error);
            setTransactions([]);
        } finally {
            setLoading(false);
        }
    }, [userID, currentPage, DebounceQuery]);

    useEffect(() => {
        setCurrentPage(1);
    }, [DebounceQuery]);

    useEffect(() => {
        getMyTransaction();
    }, [getMyTransaction]);

    //Region Get Current Transaction (Untuk Owner)
    const currentTransactionMyHotel = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getMyHotelsTransaction(userID);
            if (Array.isArray(res.data)) {
                setTransactions(res.data);
            } else {
                setTransactions([]);
            }
        } catch (error) {
            console.error('Error:', error);
            setTransactions([]);
        } finally {
            setLoading(false);
        }
    }, [userID])

    useEffect(() => {
        currentTransactionMyHotel();
    }, [currentTransactionMyHotel]);

    //Region Data Dashboard For Owner
    const monthlyIncome = useCallback(async () => {
        setLoading(true)
        try {
            const response = await getIncome(userID)
            if (response && Array.isArray(response.data)) {
                setRevenueData(response.data);
            } else {
                setRevenueData([]);
            }
        } catch (error) {
            setRevenueData([]);
        }finally{
            setLoading(false);
        }
    }, [userID])

    useEffect(() => {
        monthlyIncome()
    }, [monthlyIncome])

    return {
        transactions,
        currentPage,
        setCurrentPage,
        totalPages,
        totalItems,
        loading,
        itemPerPage,
        query,
        setQuery,
        revenueData
    };
};