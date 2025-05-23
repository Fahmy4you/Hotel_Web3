'use client'
import { getMyTransactions } from "@/app/Server/Transaction/GetMyTransactions";
import { getMyHotelsTransaction } from "@/app/Server/Transaction/owner/GetMyHotelsTransaction";
import { bookingData } from "@/types/bookingData";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { useCall } from "wagmi";

export const useMyData = (userID: number) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [query, setQuery] = useState("");
    const [DebounceQuery] = useDebounce(query, 500);
    const [transactions, setTransactions] = useState<bookingData[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [totalItems, setTotalItems] = useState<number>(0);
    const itemPerPage = 10;

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


    const getTransactionMyHotel = useCallback(async () => {
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
        getTransactionMyHotel();
    }, [getTransactionMyHotel]);


    return {
        transactions,
        currentPage,
        setCurrentPage,
        totalPages,
        totalItems,
        loading,
        itemPerPage,
        query,
        setQuery
    };
};