"use client";

import { useState } from "react";
import { Upload, X, Check, Loader2 } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";

interface CloudinaryUploadProps {
    onUpload: (urls: string[]) => void;
    label: string;
    resourceType: "image" | "video";
    multiple?: boolean;
    initialUrls?: string[];
}

export default function CloudinaryUpload({ onUpload, label, resourceType, multiple = false, initialUrls = [] }: CloudinaryUploadProps) {
    const [previews, setPreviews] = useState<string[]>(initialUrls);

    return (
        <CldUploadWidget
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_PRESET}
            onSuccess={(result: any) => {
                const url = result.info.secure_url;
                if (multiple) {
                    const newUrls = [...previews, url];
                    setPreviews(newUrls);
                    onUpload(newUrls);
                } else {
                    setPreviews([url]);
                    onUpload([url]);
                }
            }}
            options={{
                maxFiles: multiple ? 10 : 1,
                resourceType: resourceType,
                clientAllowedFormats: resourceType === 'video' ? ['mp4', 'mov', 'webm'] : ['jpg', 'png', 'webp', 'jpeg'],
            }}
        >
            {({ open }) => (
                <div className="space-y-4">
                    <label className="text-sm font-medium text-gray-400">{label}</label>
                    <div className="grid grid-cols-2 gap-4">
                        {previews.map((url, index) => (
                            <div key={index} className="relative aspect-video rounded-xl overflow-hidden border border-white/10 group">
                                {resourceType === 'video' ? (
                                    <video src={url} className="w-full h-full object-cover" />
                                ) : (
                                    <img src={url} className="w-full h-full object-cover" />
                                )}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const newUrls = previews.filter((_, i) => i !== index);
                                        setPreviews(newUrls);
                                        onUpload(newUrls);
                                    }}
                                    className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}

                        {(multiple || previews.length === 0) && (
                            <div
                                onClick={() => open()}
                                className="border-2 border-dashed border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-white/5 transition-all cursor-pointer aspect-video group"
                            >
                                <Upload size={24} className="text-gray-500 group-hover:text-primary transition-colors" />
                                <p className="text-[10px] text-gray-500 font-medium text-center">Add {resourceType}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </CldUploadWidget>
    );
}
