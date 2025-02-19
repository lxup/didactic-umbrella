'use client';
import Image from 'next/image';
import { ComponentProps, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { ImageIcon } from 'lucide-react';

interface ImageWithFallbackProps extends ComponentProps<typeof Image> {
  src: string;
  type?: 'default' | 'users';
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
        <Fallback className={cn('', className)} type={type} from="#363636" to="#363636" alt={alt} />
      )}
    </>
  );
};

export function Fallback({
  className,
  type,
  from,
  to,
}: {
  className?: string;
  type?: string | null;
  from: string;
  to: string;
  alt: string;
}) {
  return (
    <div
      style={{
        backgroundImage: `linear-gradient(to top right, ${from}, ${to})`,
      }}
      className={cn(`w-full flex items-center justify-center h-full`, className)}
    >
      {type == 'users' ? (
       <></>
      ) : (
        <ImageIcon color="#fff" className="w-2/5 h-2/5" />
      )}
    </div>
  );
}
