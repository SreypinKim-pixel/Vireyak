"use client";

import { usePathname } from "next/navigation";

export default function SiteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // Account pages are standalone previews: no navbar or footer, like `/register`.
  if (pathname === "/register" || pathname === "/login") return null;
  return children;
}
