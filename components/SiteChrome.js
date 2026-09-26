"use client";

import { usePathname } from "next/navigation";

export default function SiteChrome({ children }) {
  const pathname = usePathname();
  if (pathname === "/register") return null;
  return children;
}
