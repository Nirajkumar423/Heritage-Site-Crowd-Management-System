"use client";

import Image from "next/image";
import { useState } from "react";

export function SiteImage({
  fallbackSrc = "/destinations/taj-mahal.jpg",
  src,
  alt,
  ...props
}) {
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
