import React, { useState } from 'react';
import { Camera } from 'lucide-react';

interface FestivalImageProps {
  src: string;
  alt: string;
  title?: string;
  className?: string;
  aspectClassName?: string;
  priority?: boolean;
}

export const FestivalImage: React.FC<FestivalImageProps> = ({
  src,
  alt,
  title,
  className = '',
  aspectClassName = 'aspect-[4/3]',
  priority = false,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`relative overflow-hidden bg-gradient-to-br from-stone-200 via-stone-100 to-stone-300 flex flex-col items-center justify-center p-6 text-center ${aspectClassName} ${className}`}
        role="img"
        aria-label={alt}
      >
        <Camera className="w-8 h-8 text-stone-500 mb-2" strokeWidth={1.5} />
        <p className="text-sm font-medium text-stone-700 max-w-[20ch]">{title || alt}</p>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-stone-200 ${aspectClassName} ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-stone-200 animate-pulse" aria-hidden="true" />
      )}
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        loading={priority ? 'eager' : 'lazy'}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};
