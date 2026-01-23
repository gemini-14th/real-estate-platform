"use client";

import { CldUploadWidget } from 'next-cloudinary';
import { Upload, Check, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface CloudinaryUploadProps {
    onUpload: (url: string, type: 'video' | 'image') => void;
    resourceType: 'video' | 'image';
    label: string;
}

export default function CloudinaryUpload({ onUpload, resourceType, label }: CloudinaryUploadProps) {
    const [status, setStatus] = useState<'idle' | 'uploading' | 'success'>('idle');
    const [fileName, setFileName] = useState("");

    return (
        <CldUploadWidget
            uploadPreset="ml_default" // The user will need to create this in Cloudinary
            onUpload={(result: any) => {
                if (result.event === 'success') {
                    setStatus('success');
                    onUpload(result.info.secure_url, resourceType);
                }
            }}
            options={{
                maxFiles: 1,
                resourceType: resourceType,
                clientAllowedFormats: resourceType === 'video' ? ['mp4', 'mov', 'webm'] : ['jpg', 'png', 'webp', 'jpeg'],
            }}
        >
            {({ open }) => (
                <button
                    type="button"
                    onClick={() => {
                        setStatus('idle');
                        open();
                    }}
                    className={`w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-dashed rounded-xl transition-all ${status === 'success'
                        ? 'border-green-500/50 bg-green-500/10 text-green-500'
                        : 'border-white/10 bg-black/40 text-gray-400 hover:border-primary/50 hover:text-white'
                        }`}
                >
                    {status === 'success' ? (
                        <>
                            <Check size={20} />
                            <span>{label} Uploaded!</span>
                        </>
                    ) : (
                        <>
                            <Upload size={20} />
                            <span>{label}</span>
                        </>
                    )}
                </button>
            )}
        </CldUploadWidget>
    );
}
