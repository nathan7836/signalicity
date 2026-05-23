"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";

interface SecureImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function SecureImage({ src, alt, className = "" }: SecureImageProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (error || !src) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${className}`}>
        <ImageOff className="w-8 h-8 text-gray-300" />
      </div>
    );
  }

  return (
    <>
      {!loaded && (
        <div className={`skeleton ${className}`} />
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${loaded ? "" : "hidden"}`}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
    </>
  );
}
