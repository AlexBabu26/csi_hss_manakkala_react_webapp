
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
  
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
  const [urlInput, setUrlInput] = useState('');

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

  const handleCropComplete = async (croppedImage: string) => {
    const nextQueue = cropQueue.slice(1);
    
    // Try to upload to Backblaze B2
    let imageUrl = croppedImage;
    try {
      const { uploadAPI } = await import('../lib/api');
      const result = await uploadAPI.uploadImage(croppedImage);
      
      if (!result.fallback) {
        imageUrl = result.url;
        console.log('Image uploaded to Backblaze B2:', imageUrl);
      }
    } catch (error) {
      console.error('Upload failed, using base64:', error);
    }
    
    const allCropped = [...newlyCroppedImages, imageUrl];
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

  const handleAddFromUrl = () => {
      if (urlInput && urlInput.startsWith('http')) {
          const finalImages = [...previews, urlInput];
          setPreviews(finalImages);
          onImagesChange(finalImages);
      }
      setUrlInput('');
      setIsUrlModalOpen(false);
  }

  return (
    <div>
      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">{label}</label>
      <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
        {previews.map((src, index) => (
          <div key={index} className="relative group w-24 h-24">
            <img src={src} alt={`Preview ${index + 1}`} className="w-full h-full object-cover rounded-md" />
            <button
              type="button"
              onClick={() => handleDelete(index)}
              aria-label={`Delete image ${index + 1}`}
              className="absolute top-0 right-0 m-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
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
                title="Upload images from your device"
                className="w-full h-full flex items-center justify-center border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-md text-zinc-500 hover:border-primary-500 hover:text-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
                <span className="sr-only">Upload images</span>
                <Icon className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></Icon>
            </button>
        </div>
        <div className="w-24 h-24">
            <button
                type="button"
                onClick={() => setIsUrlModalOpen(true)}
                title="Add an image from a URL"
                className="w-full h-full flex items-center justify-center border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-md text-zinc-500 hover:border-primary-500 hover:text-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
                <span className="sr-only">Add image from URL</span>
                <Icon className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></Icon>
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
      {isUrlModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="add-url-title">
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
                <h2 id="add-url-title" className="text-xl font-bold mb-4 text-zinc-900 dark:text-white">Add Image from URL</h2>
                <div>
                    <label htmlFor="imageUrl" className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">Image URL</label>
                    <input 
                        type="url"
                        id="imageUrl"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500"
                    />
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                    <button type="button" onClick={() => { setIsUrlModalOpen(false); setUrlInput(''); }} className="px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md shadow-sm text-sm font-medium">Cancel</button>
                    <button type="button" onClick={handleAddFromUrl} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">Add Image</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default MultiImageUpload;
