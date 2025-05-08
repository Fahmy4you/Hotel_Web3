'use client';
import React, { useState, useEffect, useRef } from 'react';
import { FaHotel, FaImage, FaMapMarkerAlt, FaTimes, FaTrash } from "react-icons/fa";
import { MdDescription } from "react-icons/md";
import Image from 'next/image';
import { HotelData } from '../../../../types/hotelData';
import { gsap } from 'gsap';

interface HotelModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: HotelData) => void;
    mode: 'add' | 'edit';
    hotelData?: HotelData | null;
}

const HotelModal: React.FC<HotelModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    mode = 'add',
    hotelData = null
}) => {
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [isImageLoading, setIsImageLoading] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [formData, setFormData] = useState<HotelData>({
        user_id: 0,
        nama_hotel: '',
        desk: '',
        lokasi: '',
        images: [],
    });
    const [isPending, setIsPending] = useState(false);
    
    const modalRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Maximum number of images allowed
    const MAX_IMAGES = 3;

    useEffect(() => {
        if (hotelData) {
            setFormData({
                user_id: hotelData.user_id || 0,
                nama_hotel: hotelData.nama_hotel || '',
                desk: hotelData.desk || '',
                lokasi: hotelData.lokasi || '',
                images: hotelData.images || [],
                id: hotelData.id
            });
            
            if (hotelData.images && hotelData.images.length > 0) {
                const previews: string[] = [];
                
                // Prosess preview gambar
                hotelData.images.forEach(async (image) => {
                    if (image instanceof File) {
                        const reader = new FileReader();
                        reader.onload = () => {
                            previews.push(reader.result as string);
                            setImagePreviews([...previews]);
                        };
                        reader.readAsDataURL(image);
                    } else if (typeof image === 'string') {
                        previews.push(image);
                        setImagePreviews([...previews]);
                    }
                });
            }
        } else {
            setFormData({
                user_id: 0,
                nama_hotel: '',
                desk: '',
                lokasi: '',
                images: [],
            });
            setImagePreviews([]);
            setImageFiles([]);
        }
    }, [hotelData]);

    useEffect(() => {
        if (!isOpen || !modalRef.current) return;
        
        const tl = gsap.timeline();
        
        tl.fromTo(
            overlayRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.3 }
        );
        
        tl.fromTo(
            contentRef.current,
            { 
                y: 30,
                opacity: 0,
                scale: 0.95,
            },
            { 
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.4,
                ease: "power3.out"
            },
            "-=0.1"
        );
        
        return () => {
            tl.kill();
        };
    }, [isOpen]);

    const handleCloseWithAnimation = () => {
        if (!modalRef.current) {
            onClose();
            return;
        }
        
        const tl = gsap.timeline({
            onComplete: onClose
        });
        
        tl.to(
            contentRef.current,
            { 
                y: 20,
                opacity: 0,
                scale: 0.95,
                duration: 0.3,
                ease: "power3.in"
            }
        );
        
        tl.to(
            overlayRef.current,
            { opacity: 0, duration: 0.2 },
            "-=0.1"
        );
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setImageError(false);
        setIsImageLoading(true);
        
        // Calculate how many more files we can add
        const remainingSlots = MAX_IMAGES - imagePreviews.length;
        const filesToProcess = Array.from(files).slice(0, remainingSlots);
        
        const newImageFiles = [...imageFiles];
        const newPreviews = [...imagePreviews];
        
        const processFile = (index: number) => {
            if (index >= filesToProcess.length) {
                setImageFiles(newImageFiles);
                setImagePreviews(newPreviews);
                setIsImageLoading(false);
                return;
            }
            
            const file = filesToProcess[index];
            newImageFiles.push(file);
            
            const reader = new FileReader();
            reader.onloadend = () => {
                newPreviews.push(reader.result as string);
                processFile(index + 1);
            };
            reader.onerror = () => {
                setImageError(true);
                processFile(index + 1);
            };
            reader.readAsDataURL(file);
        };
        
        processFile(0);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleRemoveImage = (index: number) => {
        const newPreviews = [...imagePreviews];
        const newImageFiles = [...imageFiles];
        
        newPreviews.splice(index, 1);
        newImageFiles.splice(index, 1);
        
        setImagePreviews(newPreviews);
        setImageFiles(newImageFiles);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmitForm = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsPending(true);
        
        try {
          onSubmit({
            ...formData,
            images: [
              ...imageFiles,
              ...(hotelData?.images?.filter(img => typeof img === 'string') || [])
            ]
          });
        } finally {
          setIsPending(false);
          handleCloseWithAnimation();
        }
      };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto"
            ref={modalRef}
        >
            {/* Overlay */}
            <div 
                ref={overlayRef}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm dark:bg-black/80"
                onClick={handleCloseWithAnimation}
            />
            
            {/* Modal Content */}
            <div 
                ref={contentRef}
                className="relative w-full max-w-md mx-4 rounded-lg shadow-xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                    <div className="flex items-center">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                            <FaHotel className="w-4 h-4" />
                        </div>
                        <h3 className="ml-3 text-lg font-medium text-gray-900 dark:text-white">
                            {mode === 'add' ? 'Add New Hotel' : 'Edit Hotel'}
                        </h3>
                    </div>
                    <button
                        onClick={handleCloseWithAnimation}
                        className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
                    >
                        <FaTimes className="w-5 h-5" />
                    </button>
                </div>
                
                {/* Form */}
                <form onSubmit={handleSubmitForm}>
                    <div className="px-6 py-5 max-h-[calc(100vh-150px)] overflow-y-auto">
                        {/* Image Upload */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Hotel Images <span className="text-xs text-gray-500">(Max 3 Images)</span>
                            </label>
                            
                            {/* Image Previews */}
                            <div className="flex flex-wrap gap-2 mb-3">
                                {imagePreviews.map((preview, index) => (
                                    <div 
                                        key={index} 
                                        className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-inner group"
                                    >
                                        <div className="relative w-full h-full">
                                        <Image
                                        src={typeof preview === "string"
                                            ? (mode === "edit" ? `/${preview}` : preview)
                                            : URL.createObjectURL(preview)}
                                        alt={`Hotel Image ${index + 1}`}
                                        fill
                                        className="object-cover"
                                        onError={() => setImageError(true)}
                                        priority
                                        />
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute right-1 top-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600"
                                        >
                                            <FaTrash className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                                
                                {/* Upload Button (only if less than MAX_IMAGES) */}
                                {imagePreviews.length < MAX_IMAGES && (
                                    <label className="cursor-pointer w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-inner flex items-center justify-center">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            multiple
                                            disabled={isPending || imagePreviews.length >= MAX_IMAGES}
                                            ref={fileInputRef}
                                        />
                                        {isImageLoading ? (
                                            <div className="w-6 h-6 border-2 border-t-transparent border-blue-500 rounded-full animate-spin" />
                                        ) : (
                                            <FaImage className="w-8 h-8 text-gray-400" />
                                        )}
                                    </label>
                                )}
                            </div>
                            
                            {/* Upload Button (text) */}
                            {imagePreviews.length < MAX_IMAGES && (
                                <label className="cursor-pointer">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        multiple
                                        disabled={isPending || imagePreviews.length >= MAX_IMAGES}
                                        ref={fileInputRef}
                                    />
                                    <div className={`px-4 py-2 rounded-lg text-center transition-all ${
                                        isPending 
                                            ? 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500' 
                                            : 'bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30'
                                    } border border-blue-200 dark:border-blue-800 w-full`}>
                                        {imagePreviews.length > 0 ? 'Add More Images' : 'Upload Images'}
                                    </div>
                                </label>
                            )}
                        </div>

                        {/* Hotel Name */}
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Hotel Name
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <FaHotel className="h-4 w-4" />
                                </div>
                                <input
                                    type="text"
                                    name="nama_hotel"
                                    value={formData.nama_hotel}
                                    onChange={handleInputChange}
                                    disabled={isPending}
                                    placeholder="Enter hotel name"
                                    className="pl-10 w-full py-2.5 px-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Description
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-3 text-gray-400">
                                    <MdDescription className="h-4 w-4" />
                                </div>
                                <textarea
                                    name="desk"
                                    value={formData.desk}
                                    onChange={handleInputChange}
                                    disabled={isPending}
                                    placeholder="Enter hotel description"
                                    className="pl-10 w-full py-2.5 px-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px] transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Location */}
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Location
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <FaMapMarkerAlt className="h-4 w-4" />
                                </div>
                                <input
                                    type="text"
                                    name="lokasi"
                                    value={formData.lokasi}
                                    onChange={handleInputChange}
                                    disabled={isPending}
                                    placeholder="Enter hotel location"
                                    className="pl-10 w-full py-2.5 px-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* Footer with Actions */}
                    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={handleCloseWithAnimation}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                            disabled={isPending}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className={`px-4 py-2 rounded-lg transition-all ${
                                isPending 
                                    ? 'bg-blue-400 cursor-not-allowed' 
                                    : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg'
                            } text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        >
                            {isPending ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2" />
                                    <span>{mode === 'add' ? 'Adding...' : 'Updating...'}</span>
                                </div>
                            ) : (
                                <span>{mode === 'add' ? 'Add Hotel' : 'Update Hotel'}</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HotelModal;