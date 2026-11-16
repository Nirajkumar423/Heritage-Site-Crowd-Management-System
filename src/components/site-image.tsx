"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type SiteImageProps = Omit<ImageProps, "onError"> & {
  fallbackSrc?: string;
};

export function SiteImage({
  fallbackSrc = "/destinations/taj-mahal.jpg",
  src,
  alt,
  ...props
}: SiteImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt}
      onError={() => {
        if (currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        }
      }}
    />
  );
}
