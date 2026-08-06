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

/**
 * Plays the video in place. The iframe is only mounted once the teacher hits
 * play, so the page doesn't pull YouTube's player onto every resource view.
 */
export function VideoPlayer({
  youtubeId,
  title,
}: {
  youtubeId: string;
  title: string;
}) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className="aspect-video rounded-lg overflow-hidden mb-8 bg-black">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play ${title}`}
      className="block w-full aspect-video bg-gray-100 rounded-lg overflow-hidden mb-8 group cursor-pointer"
    >
      <div className="relative w-full h-full bg-black">
        <VideoThumbnail
          youtubeId={youtubeId}
          alt={title}
          className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-coral rounded-full flex items-center justify-center group-hover:bg-coral-press transition-colors">
            <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent h-20 flex items-end pb-4 pl-4">
          <span className="text-white text-sm font-semibold">WATCH HERE</span>
        </div>
      </div>
    </button>
  );
}
