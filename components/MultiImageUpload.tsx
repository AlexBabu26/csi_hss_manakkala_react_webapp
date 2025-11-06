
import React, { useState, useRef, useEffect } from 'react';
import Icon from './Icon';
import ImageCropperModal from './ImageCropperModal';

interface MultiImageUploadProps {
  label: string;
  currentImageUrls: string[];
  onImagesChange: (base64Urls: string[]) => void;
  aspect?: number;
}

const MultiImageUpload: React.FC<MultiImageUploadProps> = ({ label, currentImageUrls, onImagesChange, aspect }) => {
  const [previews, setPreviews] = useState<string[]>(currentImageUrls);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [cropQueue, setCropQueue] = useState<string[]>([]);
  const [currentCropImage, setCurrentCropImage] = useState<string | null>(null);
  const [newlyCroppedImages, setNewlyCroppedImages] = useState<string[]>([]);

  useEffect(() => {
    setPreviews(currentImageUrls);
  }, [currentImageUrls]);
  
  // Fix: Replaced Array.from().map() with a standard for loop to ensure correct
  // type inference for `file` from the `FileList` object, which was causing a
  // type error where `file` was inferred as `unknown`.
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const filePromises: Promise<string>[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files.item(i);
        if (file) {
          filePromises.push(
            new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                resolve(reader.result as string);
              };
              reader.onerror = reject;
              reader.readAsDataURL(file);
            }),
          );
        }
      }

      Promise.all(filePromises)
        .then((dataUrls) => {
          setNewlyCroppedImages([]);
          setCropQueue(dataUrls);
          setCurrentCropImage(dataUrls[0] || null);
        })
        .catch((error) => console.error('Error reading files:', error));
    }
  };

  const handleCropComplete = (croppedImage: string) => {
    const nextQueue = cropQueue.slice(1);
    const allCropped = [...newlyCroppedImages, croppedImage];
    setNewlyCroppedImages(allCropped);
    
    if (nextQueue.length > 0) {
      setCropQueue(nextQueue);
      setCurrentCropImage(nextQueue[0]);
    } else {
      // Last image cropped
      const finalImages = [...previews, ...allCropped];
      setPreviews(finalImages);
      onImagesChange(finalImages);
      resetCropperState();
    }
  };

  const resetCropperState = () => {
      setCurrentCropImage(null);
      setCropQueue([]);
      setNewlyCroppedImages([]);
      if(fileInputRef.current) {
        fileInputRef.current.value = "";
      }
  };

  const handleDelete = (indexToDelete: number) => {
    const newPreviews = previews.filter((_, index) => index !== indexToDelete);
    setPreviews(newPreviews);
    onImagesChange(newPreviews);
  };
  
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">{label}</label>
      <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
        {previews.map((src, index) => (
          <div key={index} className="relative group">
            <img src={src} alt={`Preview ${index + 1}`} className="w-24 h-24 object-cover rounded-md" />
            <button
              type="button"
              onClick={() => handleDelete(index)}
              aria-label={`Delete image ${index + 1}`}
              className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Icon className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></Icon>
            </button>
          </div>
        ))}
         <div className="w-24 h-24">
            <input
                type="file"
                accept="image/*"
                multiple
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
            />
            <button
                type="button"
                onClick={handleButtonClick}
                className="w-full h-full flex items-center justify-center border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-md text-zinc-500 hover:border-primary-500 hover:text-primary-500"
            >
                <Icon className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></Icon>
            </button>
        </div>
      </div>
       {currentCropImage && (
        <ImageCropperModal
            src={currentCropImage}
            aspect={aspect}
            onClose={resetCropperState}
            onCropComplete={handleCropComplete}
        />
      )}
    </div>
  );
};

export default MultiImageUpload;