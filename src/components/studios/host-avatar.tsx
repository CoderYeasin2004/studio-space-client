"use client";

import Image from "next/image";
import { img } from "@/lib/images";

interface HostAvatarProps {
  avatar: string;
  alt: string;
  className?: string;
}

export const HostAvatar = ({
  avatar,
  alt,
  className,
}: HostAvatarProps) => {
  return (
    <Image
      src={img(avatar, "avatar")}
      alt={alt}
      fill
      sizes="64px"
      className={className}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.src = "/images/studio-placeholder.jpg";
      }}
    />
  );
};
