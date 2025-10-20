
import React, { useState, useRef } from 'react';
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop';

interface ImageCropperModalProps {
  src: string;
  aspect?: number;
  onClose: () => void;
  onCropComplete: (croppedImageUrl: string) => void;
}

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number): Crop {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}


const ImageCropperModal: React.FC<ImageCropperModalProps> = ({ src, aspect = 1, onClose, onCropComplete }) => {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<Crop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, aspect));
  }

  const handleCropImage = () => {
    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    if (!image || !canvas || !completedCrop) {
      throw new Error('Crop canvas does not exist');
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('No 2d context');
    }

    canvas.width = Math.floor(completedCrop.width * scaleX);
    canvas.height = Math.floor(completedCrop.height * scaleY);

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height,
    );

    const base64Image = canvas.toDataURL('image/jpeg');
    onCropComplete(base64Image);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="crop-image-title">
      <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4">
        <h2 id="crop-image-title" className="text-xl font-bold mb-4 text-zinc-900 dark:text-white">Crop Image</h2>
        <div className="flex justify-center bg-zinc-200 dark:bg-zinc-900 p-4 rounded-md">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspect}
          >
            <img ref={imgRef} src={src} onLoad={onImageLoad} alt="Image to crop" style={{ maxHeight: '70vh' }} />
          </ReactCrop>
        </div>
        <canvas ref={previewCanvasRef} className="hidden" />
        <div className="mt-6 flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md shadow-sm text-sm font-medium text-zinc-700 dark:text-zinc-200 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCropImage}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            Crop Image
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropperModal;
