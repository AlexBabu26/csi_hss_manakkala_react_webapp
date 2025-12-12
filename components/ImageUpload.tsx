
import React, { useState, useRef, useEffect } from 'react';
import ImageCropperModal from './ImageCropperModal';

interface ImageUploadProps {
  label: string;
  currentImageUrl: string;
  onImageChange: (urlOrBase64: string) => void;
  aspect?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ label, currentImageUrl, onImageChange, aspect }) => {
  const [preview, setPreview] = useState<string | null>(currentImageUrl);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [inputType, setInputType] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState(currentImageUrl?.startsWith('http') ? currentImageUrl : '');
  
  useEffect(() => {
    setPreview(currentImageUrl);
    if (currentImageUrl?.startsWith('http')) {
      setUrlInput(currentImageUrl);
    }
  }, [currentImageUrl]);

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

  const handleCropComplete = async (croppedImage: string) => {
    setPreview(croppedImage);
    
    // For logos, always use base64 to avoid authentication issues with img tags
    // Check if this is a logo upload by checking the label prop
    const isLogo = label.toLowerCase().includes('logo');
    
    if (isLogo) {
      // Always use base64 for logos to ensure they work in img tags without auth
      console.log('Using base64 storage for logo (avoids authentication issues)');
      onImageChange(croppedImage);
      setImageToCrop(null);
      if(fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }
    
    // For other images, try to upload to Backblaze B2
    try {
      const { uploadAPI } = await import('../lib/api');
      const result = await uploadAPI.uploadImage(croppedImage);
      
      if (result.fallback) {
        // B2 not configured, use base64
        console.log('Using base64 storage (B2 not configured)');
        onImageChange(croppedImage);
      } else {
        // Successfully uploaded to B2
        console.log('Image uploaded to Backblaze B2:', result.url);
        onImageChange(result.url);
      }
    } catch (error) {
      console.error('Upload failed, using base64:', error);
      onImageChange(croppedImage);
    }
    
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

  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setUrlInput(e.target.value);
  }

  const handleSetUrl = () => {
      if (urlInput) {
          // A simple check to see if it looks like a URL.
          // In a real app, you might want more robust validation or an image pre-loader.
          setPreview(urlInput);
          onImageChange(urlInput);
      }
  }

  const activeBtnClasses = "bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-white";
  const inactiveBtnClasses = "bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700";
  const btnBaseClasses = "px-3 py-1 border border-zinc-300 dark:border-zinc-600 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500";

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
        <div className="flex flex-col space-y-2 items-start">
            <div className="flex space-x-1">
                 <button type="button" onClick={() => setInputType('upload')} className={`${btnBaseClasses} ${inputType === 'upload' ? activeBtnClasses : inactiveBtnClasses}`}>Upload</button>
                 <button type="button" onClick={() => setInputType('url')} className={`${btnBaseClasses} ${inputType === 'url' ? activeBtnClasses : inactiveBtnClasses}`}>URL</button>
            </div>

            {inputType === 'upload' && (
                <div>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={handleUploadButtonClick}
                      className="px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md shadow-sm text-sm font-medium text-zinc-700 dark:text-zinc-200 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Change Image
                    </button>
                </div>
            )}
            
            {inputType === 'url' && (
                <div className="flex items-center space-x-2">
                    <input 
                        type="url" 
                        placeholder="https://example.com/image.jpg"
                        value={urlInput}
                        onChange={handleUrlChange}
                        className="block w-full min-w-[200px] px-3 py-2 bg-white dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 rounded-md shadow-sm text-sm focus:outline-none focus:ring-primary-500"
                    />
                    <button 
                        type="button"
                        onClick={handleSetUrl}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        Set
                    </button>
                </div>
            )}
        </div>
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
