import React, { useState, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'eager' | 'lazy';
  style?: React.CSSProperties;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({ 
  src, 
  alt, 
  className = '', 
  loading = 'lazy',
  style 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>('');

  useEffect(() => {
    // Preload image
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImageSrc(src);
      setImageLoaded(true);
    };
    img.onerror = () => {
      // Fallback for error
      setImageSrc(src);
      setImageLoaded(true);
    };
  }, [src]);

  return (
    <div className="relative w-full h-full">
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-200 via-zinc-300 to-zinc-200 dark:from-zinc-700 dark:via-zinc-600 dark:to-zinc-700 animate-pulse" />
      )}
      <img
        src={imageSrc}
        alt={alt}
        className={`${className} ${!imageLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        loading={loading}
        style={style}
      />
    </div>
  );
};

export default OptimizedImage;

