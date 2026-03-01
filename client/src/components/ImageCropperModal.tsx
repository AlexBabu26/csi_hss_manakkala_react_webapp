"use client";

import React, { useState, useRef, useCallback } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageCropperModalProps {
    isOpen: boolean;
    imageSrc: string;
    onClose: () => void;
    onCropComplete: (croppedImageUrl: string) => void;
    aspectRatio?: number;
}

export default function ImageCropperModal({ isOpen, imageSrc, onClose, onCropComplete, aspectRatio = 16 / 9 }: ImageCropperModalProps) {
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const imgRef = useRef<HTMLImageElement>(null);

    const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
        const { width, height } = e.currentTarget;
        const crop = centerCrop(
            makeAspectCrop({ unit: '%', width: 90 }, aspectRatio, width, height),
            width,
            height
        );
        setCrop(crop);
    }, [aspectRatio]);

    const handleCropComplete = async () => {
        if (completedCrop && imgRef.current) {
            const image = imgRef.current;
            const canvas = document.createElement('canvas');
            const scaleX = image.naturalWidth / image.width;
            const scaleY = image.naturalHeight / image.height;
            canvas.width = completedCrop.width;
            canvas.height = completedCrop.height;
            const ctx = canvas.getContext('2d');

            if (!ctx) return;

            ctx.drawImage(
                image,
                completedCrop.x * scaleX,
                completedCrop.y * scaleY,
                completedCrop.width * scaleX,
                completedCrop.height * scaleY,
                0,
                0,
                completedCrop.width,
                completedCrop.height
            );

            const base64Image = canvas.toDataURL('image/jpeg');
            onCropComplete(base64Image);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white dark:bg-zinc-800 rounded-lg max-w-3xl w-full max-h-[90vh] flex flex-col">
                <div className="p-4 border-b border-zinc-200 dark:border-zinc-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold">Crop Image</h2>
                    <button onClick={onClose} className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <div className="p-4 flex-grow overflow-auto flex justify-center bg-zinc-100 dark:bg-zinc-900">
                    {imageSrc && (
                        <ReactCrop
                            crop={crop}
                            onChange={(_, percentCrop) => setCrop(percentCrop)}
                            onComplete={(c) => setCompletedCrop(c)}
                            aspect={aspectRatio}
                        >
                            <img
                                ref={imgRef}
                                src={imageSrc}
                                onLoad={onImageLoad}
                                alt="Crop me"
                                className="max-w-full h-auto"
                            />
                        </ReactCrop>
                    )}
                </div>

                <div className="p-4 border-t border-zinc-200 dark:border-zinc-700 flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 text-zinc-700 hover:bg-zinc-100 rounded-md dark:text-zinc-300 dark:hover:bg-zinc-700">Cancel</button>
                    <button onClick={handleCropComplete} className="bg-primary-600 hover:bg-primary-700 text-white dark:bg-hc-interactive dark:hover:bg-hc-accent dark:text-hc-bg px-4 py-2 rounded-md font-medium">Apply Crop</button>
                </div>
            </div>
        </div>
    );
}
