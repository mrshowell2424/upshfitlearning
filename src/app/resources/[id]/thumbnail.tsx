"use client";

import { useState } from "react";

/**
 * YouTube only generates maxresdefault.jpg for videos uploaded in HD — roughly a
 * third of the library has none, which renders as a broken image. Fall back to
 * hqdefault.jpg, which always exists.
 */
export function VideoThumbnail({
  youtubeId,
  alt,
  className = "",
}: {
  youtubeId: string;
  alt: string;
  className?: string;
}) {
  const [src, setSrc] = useState(
    `https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`
  );

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setSrc(`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`)}
    />
  );
}
