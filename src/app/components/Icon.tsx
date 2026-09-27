import { MapPin, Globe, ArrowRight, Phone, Mail } from "lucide-react";
import { FaFacebook, FaInstagram, FaYoutube, FaGithub } from "react-icons/fa6";

export type IconName =
  | "pin"
  | "globe"
  | "arrow"
  | "phone"
  | "mail"
  | "facebook"
  | "instagram"
  | "youtube"
  | "github"
  | "logo-white"; // 1. Added logo-white type

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
}

export default function Icon({ name, size = 16, className = "" }: IconProps) {
  switch (name) {
    case "pin":
      return <MapPin size={size} className={className} />;
    case "globe":
      return <Globe size={size} className={className} />;
    case "arrow":
      return <ArrowRight size={size} className={className} />;
    case "phone":
      return <Phone size={size} className={className} />;
    case "mail":
      return <Mail size={size} className={className} />;
    case "facebook":
      return <FaFacebook size={size} className={className} />;
    case "instagram":
      return <FaInstagram size={size} className={className} />;
    case "youtube":
      return <FaYoutube size={size} className={className} />;
    case "github":
      return <FaGithub size={size} className={className} />;
    case "logo-white": // 2. Added logo-white case (renders image from public folder)
      return (
        <img
          src="/logo-white.svg" // Replace with /logo-white.png if it is a PNG
          alt="Logo"
          width={size}
          height={size}
          className={`object-contain ${className}`}
        />
      );
    default:
      return null;
  }
}