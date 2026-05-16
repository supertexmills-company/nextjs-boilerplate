"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useState } from "react";

interface AppImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  fill?: boolean;
  sizes?: string;
  onClick?: () => void;
  fallbackSrc?: string;
}

function AppImage({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  quality = 75,
  placeholder = "empty",
  blurDataURL,
  fill = false,
  sizes,
  onClick,
  fallbackSrc = "images/no_image.jpg",
  ...props
}: AppImageProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const isExternal =
    imageSrc.startsWith("http://") || imageSrc.startsWith("https://");
  const isLocal =
    imageSrc.startsWith("/") ||
    imageSrc.startsWith("./") ||
    imageSrc.startsWith("data:");

  const handleError = () => {
    if (!hasError && imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
      setHasError(true);
    }
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const commonClassName = `${className} ${isLoading ? "bg-gray-200" : ""} ${onClick ? "cursor-pointer transition-opacity hover:opacity-90" : ""}`;

  if (isExternal && !isLocal) {
    const imgStyle: CSSProperties = {};
    if (width) imgStyle.width = width;
    if (height) imgStyle.height = height;

    if (fill) {
      return (
        <div
          className={`relative ${className}`}
          style={{ width: width || "100%", height: height || "100%" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={alt}
            className={`${commonClassName} absolute inset-0 h-full w-full object-cover`}
            onError={handleError}
            onLoad={handleLoad}
            onClick={onClick}
            style={imgStyle}
            {...props}
          />
        </div>
      );
    }

    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageSrc}
        alt={alt}
        className={commonClassName}
        onError={handleError}
        onLoad={handleLoad}
        onClick={onClick}
        style={imgStyle}
        {...props}
      />
    );
  }

  const imageProps = {
    src: imageSrc,
    className: commonClassName,
    priority,
    quality,
    placeholder,
    blurDataURL,
    unoptimized: true,
    onError: handleError,
    onLoad: handleLoad,
    onClick,
    ...props,
  };

  if (fill) {
    return (
      <div className={`relative ${className}`}>
        <Image
          {...imageProps}
          alt={alt}
          fill
          sizes={sizes || "100vw"}
          style={{ objectFit: "cover" }}
        />
      </div>
    );
  }

  return (
    <Image
      {...imageProps}
      alt={alt}
      width={width || 400}
      height={height || 300}
    />
  );
}

export default AppImage;
