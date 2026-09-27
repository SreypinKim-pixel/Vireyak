import Icon from "../Icon";

type ProfileLink = { label: string; href: string };

/**
 * Optional social or contact links for a profile card. `links` entries are
 * { label, href }. Anything that is not a mailto: link opens in a new tab.
 * An empty list renders nothing, so cards stay clean until real links exist.
 */
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
      : "border-slate/25 text-ink/70 hover:border-indigo hover:text-indigo dark:hover:border-brightgold dark:hover:text-brightgold";

  return (
    <div
      className={`mt-5 flex flex-wrap gap-2 ${justify === "start" ? "justify-start" : "justify-center"}`}
    >
      {links.map((link) => {
        const isEmail =
          typeof link.href === "string" && link.href.startsWith("mailto:");
        return (
          <a
            key={`${link.label}-${link.href}`}
            href={link.href}
            target={isEmail ? undefined : "_blank"}
            rel={isEmail ? undefined : "noreferrer"}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-medium transition ${toneClasses}`}
          >
            <Icon name={isEmail ? "mail" : "globe"} size={12} />
            {link.label || "Profile"}
          </a>
        );
      })}
    </div>
  );
}
