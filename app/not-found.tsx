import Link from "next/link";
import Icon from "../components/Icon";
export default function NotFound() {
  return (
    <div className="status-page">
      <Icon name="globe" size={50} className="text-gold" />
      <span className="eyebrow">A small detour · 404</span>
      <h1>Off the beaten path.</h1>
      <p>
        We couldn&apos;t find this page. There&apos;s still a world of wonder to
        explore.
      </p>
      <Link href="/" className="button-primary">
        Back to the journey <Icon name="arrow" size={16} />
      </Link>
    </div>
  );
}
