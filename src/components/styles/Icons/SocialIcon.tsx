import Facebook from "@/assets/icons/Facebook.svg";
import Twitter from "@/assets/icons/Twitter.svg";
import Instagram from "@/assets/icons/Instagram.svg";
import YouTube from "@/assets/icons/YouTube.svg";
import LinkedIn from "@/assets/icons/LinkedIn.svg";
import TikTok from "@/assets/icons/TikTok.svg";

import Image from "next/image";
import { Tooltip } from "@mui/material";
import Link from "next/link";

type SocialType =
  | "facebook"
  | "twitter"
  | "instagram"
  | "youtube"
  | "linkedin"
  | "tiktok";

type SocialIconProps = {
  social: SocialType;
  size?: number | undefined;
  className?: string | undefined;
};

type SocialIconType = {
  social: SocialType;
  src: string;
  alt: string;
  href: string;
};

const socials: SocialIconType[] = [
  {
    social: "facebook",
    src: Facebook.src,
    alt: "Facebook",
    href: "",
  },
  {
    social: "twitter",
    src: Twitter.src,
    alt: "Twitter",
    href: "",
  },
  {
    social: "instagram",
    src: Instagram.src,
    alt: "Instagram",
    href: "",
  },
  {
    social: "youtube",
    src: YouTube.src,
    alt: "YouTube",
    href: "",
  },
  {
    social: "linkedin",
    src: LinkedIn.src,
    alt: "LinkedIn",
    href: "",
  },
  {
    social: "tiktok",
    src: TikTok.src,
    alt: "TikTok",
    href: "",
  },
];

function getSizePair(
  social: SocialType,
  size: number
): { width: number; height: number } {
  switch (social) {
    case "twitter":
    case "instagram":
    case "linkedin":
    case "tiktok":
      return { width: size, height: size };
    case "facebook":
      return { width: (size / 20) * 9, height: size };
    case "youtube":
      return { width: (size / 20) * 23, height: size };
    default:
      throw new Error(`Invalid social type: ${social}`);
  }
}

export default function SocialIcon({
  social,
  size,
  className,
}: SocialIconProps) {
  const dimension = size ? size : 20;

  return (
    <Link href={socials.find((s) => s.social === social)!.href}>
      <Tooltip title={socials.find((s) => s.social === social)!.alt}>
        <Image
          src={socials.find((s) => s.social === social)!.src}
          width={getSizePair(social, dimension).width}
          height={getSizePair(social, dimension).height}
          alt={socials.find((s) => s.social === social)!.alt}
          className={className}
          style={{ marginInline: "10px" }}
        />
      </Tooltip>
    </Link>
  );
}
