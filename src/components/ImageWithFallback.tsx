'use client';
import Image from 'next/image';
import { ComponentProps, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { ImageIcon } from 'lucide-react';

interface ImageWithFallbackProps extends ComponentProps<typeof Image> {
  src: string;
  type?: 'default' | 'alt';
  blurDataURL?: string;
}

export const ImageWithFallback = ({
  src,
  alt,
  type = 'default',
  blurDataURL,
  className,
  ...rest
}: ImageWithFallbackProps) => {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <>
      {imgSrc ? (
        <Image
          alt={alt}
          src={imgSrc}
          className={cn('', className)}
          onError={() => {
            setImgSrc('');
          }}
          placeholder={blurDataURL ? 'blur' : 'empty'}
          blurDataURL={blurDataURL}
          {...rest}
        />
      ) : (
        <Fallback className={cn('', className)} type={type} alt={alt} />
      )}
    </>
  );
};

export function Fallback({
  className,
  type,
  from,
  to,
  alt,
}: {
  className?: string;
  type?: string | null;
  from?: string;
  to?: string;
  alt: string;
}) {
  return (
    <div
      style={{
        backgroundImage: (from && to) ? `linear-gradient(to top right, ${from}, ${to})` : '',
      }}
      className={cn(
        `w-full flex items-center justify-center h-full overflow-hidden`,
        !(from && to) && 'bg-muted',
        className
      )}
    >
      {type == 'alt' ? (
       <p>{alt}</p>
      ) : (
        <ImageIcon color="#fff" className="w-2/5 h-2/5" />
      )}
    </div>
  );
}
