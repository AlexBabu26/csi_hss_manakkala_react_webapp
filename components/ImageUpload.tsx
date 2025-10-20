
import React, { useState, useRef } from 'react';
import ImageCropperModal from './ImageCropperModal';

interface ImageUploadProps {
  label: string;
  currentImageUrl: string;
  onImageChange: (base64: string) => void;
  aspect?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ label, currentImageUrl, onImageChange, aspect }) => {
  const [preview, setPreview] = useState<string | null>(currentImageUrl);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageToCrop(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedImage: string) => {
    setPreview(croppedImage);
    onImageChange(croppedImage);
    setImageToCrop(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };
  
  const handleCloseCropper = () => {
      setImageToCrop(null);
      if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">{label}</label>
      <div className="mt-2 flex items-center space-x-4">
        {preview ? (
          <img src={preview} alt="Current" className="w-24 h-16 object-cover rounded-md" />
        ) : (
          <div className="w-24 h-16 bg-zinc-200 dark:bg-zinc-700 rounded-md flex items-center justify-center text-zinc-500">
            No Image
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={handleButtonClick}
          className="px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md shadow-sm text-sm font-medium text-zinc-700 dark:text-zinc-200 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Change
        </button>
      </div>

      {imageToCrop && (
        <ImageCropperModal
            src={imageToCrop}
            aspect={aspect}
            onClose={handleCloseCropper}
            onCropComplete={handleCropComplete}
        />
      )}
    </div>
  );
};

export default ImageUpload;
