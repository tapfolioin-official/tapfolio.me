"use client";

import React from "react";

/**
 * Client-side image component with fallback on error.
 * Needed because onError is an event handler and cannot be used in Server Components.
 */
export default function AvatarImage({
  src,
  alt,
  className,
  fallback = "/avatar.png",
}: {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        (e.target as HTMLImageElement).src = fallback;
      }}
    />
  );
}
