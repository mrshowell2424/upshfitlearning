"use client";

import Image from "next/image";
import { useAuth } from "@/providers/AuthProvider";

interface ResourceCardProps {
  id: string;
  title: string;
  purpose: string;
  format: string;
  grade_band: string;
  skill: string;
  youtube_id: string;
  published_at?: string;
  is_free: boolean;
  thumbnail_url?: string;
}

export default function ResourceCard({
  id,
  title,
  purpose,
  format,
  grade_band,
  skill,
  youtube_id,
  published_at,
  is_free,
  thumbnail_url,
}: ResourceCardProps) {
  const { isPremium } = useAuth();
  // Try to get a meaningful thumbnail - use the format type for color coding
  const getThumbnailColor = () => {
    const colors: Record<string, string> = {
      'Video': '#FFB3AF',
      'Slides': '#B3D9FF',
      'Doc': '#FFE5B3',
      'Worksheet': '#B3FFB3',
      'Guide': '#E5B3FF',
      'Link': '#D9D9D9',
    }
    return colors[format] || '#E0E0E0'
  }

  const thumbnailUrl = thumbnail_url || (youtube_id ? `https://i.ytimg.com/vi/${youtube_id}/mqdefault.jpg` : undefined);
  const formatColors: Record<string, string> = {
    Slides: "bg-blue-50 text-blue-700",
    Doc: "bg-amber-50 text-amber-700",
    Sheet: "bg-teal-50 text-teal-700",
    Video: "bg-pink-50 text-pink-700",
    Guide: "bg-purple-50 text-purple-700",
    Link: "bg-gray-100 text-gray-700",
  };

  const formatColor = formatColors[format] || "bg-gray-100 text-gray-700";

  const date = published_at
    ? new Date(published_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <a
      href={`/resources/${id}`}
      className="group rounded-[14px] overflow-hidden bg-white border border-border hover:border-charcoal transition-colors"
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-video bg-gray-100 overflow-hidden" style={thumbnailUrl ? {} : { backgroundColor: getThumbnailColor() }}>
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none'
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold opacity-20">
            {format.charAt(0)}
          </div>
        )}

        {/*
          Locked only for a teacher who cannot open it. This used to blur every
          paid thumbnail regardless of who was looking, so an All-Access member
          saw their own library behind frosted glass with a badge telling them
          to buy what they had already bought.

          Entitled members still get the badge — it says which tier the resource
          belongs to — but tucked in the corner rather than over the image.
        */}
        {!is_free &&
          (isPremium ? (
            <div className="absolute top-2 right-2 bg-charcoal/85 text-white px-2.5 py-1 rounded-full text-[10px] font-bold tracking-[0.08em]">
              ALL-ACCESS
            </div>
          ) : (
            <div
              className="absolute inset-0 backdrop-blur-sm flex items-center justify-center"
              style={{ backgroundColor: "rgba(255,255,255,0.55)" }}
            >
              <div className="bg-charcoal text-white px-4 py-2 rounded-full text-[12px] font-bold">
                ALL-ACCESS
              </div>
            </div>
          ))}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col h-32">
        <h3 className="text-[15.5px] font-semibold text-charcoal mb-1 line-clamp-2">
          {title}
        </h3>

        <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-text-faint mb-2">
          {purpose}
        </p>

        <div className="flex gap-1 mt-auto flex-wrap">
          <span className="text-[10.5px] font-semibold px-2 py-1 rounded-full bg-blue-50 text-blue-700">
            {grade_band}
          </span>
          <span className="text-[10.5px] font-semibold px-2 py-1 rounded-full bg-teal-50 text-teal-700">
            {skill}
          </span>
        </div>
      </div>
    </a>
  );
}
