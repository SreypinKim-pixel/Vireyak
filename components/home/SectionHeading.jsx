export default function SectionHeading({
  eyebrow,
  title,
  description,
  centered = false,
  id,
  children,
}) {
  return (
    <div
      className={
        centered
          ? "mx-auto max-w-2xl text-center"
          : "flex flex-wrap items-end justify-between gap-5"
      }
    >
      <div>
        <p className="eyebrow mb-3">{eyebrow}</p>
        <h2 id={id} className="section-title">
          {title}
        </h2>
        {description && (
          <p
            className={`mt-3 max-w-xl text-sm leading-6 text-ink/60 ${centered ? "mx-auto" : ""}`}
          >
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}
