import Icon from "../Icon";
import { GitHub, Telegram } from "./SocialIcons";

type ProfileLink = { label: string; href: string };

export default function ProfileLinks({
  links,
  tone = "light",
  justify = "center",
}: {
  links?: ProfileLink[];
  tone?: "light" | "dark";
  justify?: "center" | "start";
}) {
  if (!Array.isArray(links) || links.length === 0) return null;

  const toneClasses =
    tone === "dark"
      ? "border-white/25 text-ivory/75 hover:border-brightgold hover:text-brightgold"
      : "border-slate/60 dark:border-slate/25 text-ink/70 hover:border-indigo hover:text-indigo dark:hover:border-brightgold dark:hover:text-brightgold";

  return (
    <div
      className={`mt-5 flex flex-wrap gap-2 ${justify === "start" ? "justify-start" : "justify-center"}`}
    >
      {links.map((link) => {
        const isEmail =
          typeof link.href === "string" && link.href.startsWith("mailto:");
        const SocialIcon =
          link.label === "GitHub"
            ? GitHub
            : link.label === "Telegram"
              ? Telegram
              : null;
        const content = SocialIcon ? (
          <SocialIcon width={22} height={22} aria-hidden="true" />
        ) : (
          <>
            <Icon name={isEmail ? "mail" : "globe"} size={14} />
            {link.label || "Profile"}
          </>
        );
        const className = `inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-full border p-2.5 text-xs font-medium transition-colors duration-500 ease-out motion-reduce:transition-none ${SocialIcon ? "bg-navy" : ""} ${toneClasses}`;
        if (!link.href?.trim()) {
          return (
            <span
              key={link.label}
              role="link"
              aria-disabled="true"
              aria-label={`${link.label} — profile coming soon`}
              title={`${link.label} — profile coming soon`}
              className={`${className} cursor-default`}
            >
              {content}
            </span>
          );
        }
        return (
          <a
            key={`${link.label}-${link.href}`}
            href={link.href.trim()}
            aria-label={link.label || "Profile"}
            title={link.label || "Profile"}
            target={isEmail ? undefined : "_blank"}
            rel={isEmail ? undefined : "noreferrer"}
            className={className}
          >
            {content}
          </a>
        );
      })}
    </div>
  );
}
