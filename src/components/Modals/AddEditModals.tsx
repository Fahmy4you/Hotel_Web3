import React, { useState, useTransition, useEffect } from 'react';
import { AddUser } from '@/app/Server/AddUser';
import { FaRegUserCircle } from "react-icons/fa";
import { FaRegUser, FaWhatsapp, FaRegCopy } from "react-icons/fa6";
import { LuWallet } from "react-icons/lu";
import { IoCloseSharp } from "react-icons/io5";
import { editUser } from '@/app/Server/Users/EditUser';
import { UserData } from '../../../types/userData';
import { useRouter } from 'next/navigation';

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: (userData: UserData) => void;
    mode: 'add' | 'edit';
    userData?: UserData | null;
}

const UserModal: React.FC<UserModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    mode = 'add',
    userData = null
}) => {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<UserData>({
        nama: '',
        wallet_address: '',
        no_wa: ''
    });

    const router = useRouter();
    useEffect(() => {
        if (userData) {
            setFormData({
                nama: userData.nama || '',
                wallet_address: userData.wallet_address || '',
                no_wa: userData.no_wa || ''
            });
        } else {
            setFormData({
                nama: '',
                wallet_address: '',
                no_wa: ''
            });
        }
    }, [userData]);

    const generateRandomWallet = (): void => {
        const hex = '0123456789abcdef';
        let wallet = '0x';
        for (let i = 0; i < 40; i++) {
            wallet += hex[Math.floor(Math.random() * 16)];
        }
        setFormData(prev => ({ ...prev, wallet_address: wallet }));
    };

    const copyToClipboard = (text: string): void => {
        navigator.clipboard.writeText(text);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {

        const submitData = mode === 'edit' && userData?.id
            ? { ...formData, id: userData.id }
            : formData;

        onSubmit?.(submitData);
        setError(null);

        // Validasi 
        if (!formData.nama || !formData.wallet_address || !formData.no_wa) {
            setError('Please fill all fields');
            return;
        }

        startTransition(async () => {
            try {
                if (mode === 'add') {
                    const formDataToSubmit = new FormData();
                    formDataToSubmit.append('nama', formData.nama);
                    formDataToSubmit.append('wallet_address', formData.wallet_address);
                    formDataToSubmit.append('no_wa', formData.no_wa);

                    const result = await AddUser(formDataToSubmit);
                    if(result.succces) {
                        router.prefetch('/dashboard/admin/users');
                        console.log('User added successfully:', result.data);
                    }
                } else if (onSubmit) {
                    onSubmit(formData);
                    await editUser(userData?.id as number, formData);
                }

                onClose();
            } catch (err) {
                setError('Failed to submit data. Please try again.');
                console.error('Submission error:', err);
            }
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden border border-gray-200 dark:border-gray-700">
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                        <FaRegUserCircle className="w-5 h-5 mr-2 text-purple-600" />
                        {mode === 'add' ? 'Add New User' : 'Edit User'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <IoCloseSharp className="w-5 h-5" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="px-6 py-4">
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            User Name
                        </label>
                        <div className="relative">
                            <FaRegUser className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                name="nama"
                                value={formData.nama}
                                onChange={handleChange}
                                className="pl-10 w-full py-2 px-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Enter username"
                                disabled={isPending}
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Wallet Address
                        </label>
                        <div className="relative">
                            <LuWallet className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                name="wallet_address"
                                value={formData.wallet_address.substring(0, 27) + '...'}
                                onChange={handleChange}
                                className="pl-10 w-full py-2 px-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="0x..."
                                disabled={isPending}
                            />
                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex">
                                <button
                                    type="button"
                                    onClick={() => copyToClipboard(formData.wallet_address)}
                                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    disabled={isPending}
                                >
                                    <FaRegCopy className="h-4 w-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={generateRandomWallet}
                                    className="ml-1 text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-1 rounded hover:bg-purple-200 dark:hover:bg-purple-800"
                                    disabled={isPending}
                                >
                                    Generate
                                </button>
                            </div>
                        </div>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Ethereum address format (0x followed by 40 hexadecimal characters)
                        </p>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            WhatsApp Number
                        </label>
                        <div className="relative">
                            <FaWhatsapp className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                name="no_wa"
                                value={formData.no_wa}
                                onChange={handleChange}
                                className="pl-10 w-full py-2 px-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Enter WhatsApp number"
                                disabled={isPending}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            disabled={isPending}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isPending}
                            className={`px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${isPending ? 'opacity-70 cursor-not-allowed' : 'hover:from-purple-700 hover:to-purple-900'
                                }`}
                        >
                            {isPending ? 'Processing...' : mode === 'add' ? 'Add User' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserModal;