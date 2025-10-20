import React, { useState, useRef } from 'react';
import Icon from './Icon';

interface MultiImageUploadProps {
  label: string;
  currentImageUrls: string[];
  onImagesChange: (base64Urls: string[]) => void;
}

const MultiImageUpload: React.FC<MultiImageUploadProps> = ({ label, currentImageUrls, onImagesChange }) => {
  const [previews, setPreviews] = useState<string[]>(currentImageUrls);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const existingPreviews = [...previews];
      const fileArray = Array.from(files);
      let newPreviews: string[] = [];
      
      let filesProcessed = 0;
      fileArray.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result as string);
          filesProcessed++;
          if (filesProcessed === fileArray.length) {
            const allPreviews = [...existingPreviews, ...newPreviews];
            setPreviews(allPreviews);
            onImagesChange(allPreviews);
          }
        };
        reader.readAsDataURL(file);
      });
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
    </div>
  );
};

export default MultiImageUpload;
