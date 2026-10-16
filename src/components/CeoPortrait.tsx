import React, { useState, useEffect } from 'react';
import { GHAZI_PHOTO_URL, GHAZI_PHOTO_PINK_URL } from '../assets/images/ceoPhoto';

interface CeoPortraitProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'hero';
  rounded?: 'full' | '2xl' | '3xl';
  showBorder?: boolean;
  variant?: 'main' | 'pink';
  alt?: string;
}

export const CeoPortrait: React.FC<CeoPortraitProps> = ({
  className = '',
  size = 'md',
  rounded = '2xl',
  showBorder = true,
  variant = 'main',
  alt = 'Ghazi Wazir — CEO, Back for Brand LLC & Business Consultant, Bab Al-Khaleej Bahrain',
}) => {
  const initialSrc = variant === 'pink' ? GHAZI_PHOTO_PINK_URL : GHAZI_PHOTO_URL;
  const [imgSrc, setImgSrc] = useState<string>(initialSrc);

  useEffect(() => {
    setImgSrc(variant === 'pink' ? GHAZI_PHOTO_PINK_URL : GHAZI_PHOTO_URL);
  }, [variant]);

  const sizeClasses = {
    xs: 'w-8 h-8',
    sm: 'w-10 h-10',
    md: 'w-24 h-24 sm:w-28 sm:h-28',
    lg: 'w-36 h-36 sm:w-44 sm:h-44',
    hero: 'w-full h-full object-cover',
  };

  const dimensions = {
    xs: { width: 32, height: 32 },
    sm: { width: 40, height: 40 },
    md: { width: 112, height: 112 },
    lg: { width: 176, height: 176 },
    hero: { width: 400, height: 400 },
  };

  const roundedClasses = {
    full: 'rounded-full',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
  };

  const borderClass = showBorder
    ? 'border-2 border-[#e8c872] shadow-[0_0_20px_rgba(232,200,114,0.2)]'
    : '';

  return (
    <img
      src={imgSrc}
      alt={alt}
      width={dimensions[size].width}
      height={dimensions[size].height}
      decoding="async"
      loading={size === 'hero' ? 'eager' : 'lazy'}
      referrerPolicy="no-referrer"
      onError={() => {
        const fallback = variant === 'pink' ? '/ghazi-wazir-pink-suit.jpg' : '/ghazi-wazir.jpg';
        if (imgSrc !== fallback) {
          setImgSrc(fallback);
        }
      }}
      className={`object-cover ${sizeClasses[size]} ${roundedClasses[rounded]} ${borderClass} ${className}`}
    />
  );
};
