import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../libs/store";
import { GrCloudUpload } from "react-icons/gr";


export default function Uploader() {
    const darkMode = useSelector((state: RootState) => state.theme.darkMode);
    const [preview, setPreview] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);

    const handleFile = (file: File) => {
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
            setFileName(file.name);
        }
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    }, []);

    const handlePaste = useCallback((e: React.ClipboardEvent) => {
        const items = e.clipboardData.items;
        for (const item of items) {
            if (item.type.includes("image")) {
                const file = item.getAsFile();
                if (file) handleFile(file);
            }
        }
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    return (
        <div
            className={`relative border-2 rounded-xl p-6 text-center transition-all ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
                }`}
            onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onPaste={handlePaste}
        >
            <input
                type="file"
                accept="image/*"
                onChange={handleInputChange}
                className="hidden"
                id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer text-gray-600">
                {preview ? (
                    <>
                        <img src={preview} alt="Preview" className="mx-auto max-h-64 object-contain rounded-lg" />
                        <p className="mt-2 text-sm font-medium text-gray-700">{fileName}</p>
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-2">
                        <GrCloudUpload size={50} className={` ${darkMode ? 'text-white-50' : 'text-gray-900'}`}/>
                        <p className={` ${darkMode ? 'text-white-50' : 'text-gray-900'} text-lg font-semibold`}>Drag & Drop, Paste, or Click to Upload</p>
                        <p className={` ${darkMode ? 'text-white-50' : 'text-gray-900'} text-sm mt-1`}>Only image files are supported</p>
                    </div>
                )}
            </label>
        </div>
    );
}
