import { aboutFaqs } from "../../data/about";

export default function AboutFaqs() {
  return (
    <section id="questions" className="shell max-w-[850px] scroll-mt-8 py-14">
      <p className="eyebrow mb-3">{aboutFaqs.eyebrow}</p>
      <h2 className="section-title mb-8">{aboutFaqs.title}</h2>
      <div className="divide-y divide-slate/50 dark:divide-slate/20">
        {aboutFaqs.questions.map(({ question, answer }) => (
          <details key={question} className="group py-5">
            <summary className="cursor-pointer text-sm font-medium text-navy dark:text-ivory">
              {question}
            </summary>
            <p className="mt-4 text-xs leading-7 text-ink/65">{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
