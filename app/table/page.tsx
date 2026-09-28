import { permanentRedirect } from "next/navigation";
export default function LegacyTablePage() {
  permanentRedirect("/stays");
}
