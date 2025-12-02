import React, { useState } from 'react';
import Icon from './Icon';
import OptimizedImage from './OptimizedImage';
import { useAccessibility } from '../hooks/useAccessibility';

interface ImageSliderProps {
  images: { src: string; alt: string; }[];
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { preferences } = useAccessibility();
  const transitionClass = preferences.motion === 'reduced' ? '' : 'transition-transform duration-500 ease-in-out';

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg">
      <div
        className={`flex h-full ${transitionClass}`}
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div key={index} className="w-full h-full flex-shrink-0">
            <OptimizedImage
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
              loading={index === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}
      </div>

      <button
        onClick={goToPrevious}
        aria-label="Previous image"
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-white"
      >
        <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></Icon>
      </button>

      <button
        onClick={goToNext}
        aria-label="Next image"
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-white"
      >
        <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></Icon>
      </button>
    </div>
  );
};

export default ImageSlider;
