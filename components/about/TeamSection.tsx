import { mentor, teamMembers, teamSection } from "../../data/team";
import MentorCard from "./MentorCard";
import TeamGallery from "./TeamGallery";

export default function TeamSection() {
  return (
    <section id="team" className="shell scroll-mt-8 py-14 sm:py-16">
      <div className="max-w-2xl">
        <p className="eyebrow mb-3">{teamSection.eyebrow}</p>
        <h2 className="section-title">{teamSection.title}</h2>
        <p className="mt-4 text-xs leading-7 text-ink/60">
          {teamSection.description}
        </p>
      </div>

      {mentor ? (
        <div className="mt-10">
          <h3 className="section-title text-lg">{teamSection.mentorTitle}</h3>
          <p className="mt-3 max-w-2xl text-xs leading-6 text-ink/55">
            {teamSection.mentorDescription}
          </p>
          <div className="mt-6">
            <MentorCard mentor={mentor} />
          </div>
        </div>
      ) : null}

      <div className="mt-14">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <h3 className="section-title text-lg">{teamSection.membersTitle}</h3>
          <p className="text-xs text-ink/55">
            Hover a card — or tap one on a touch screen — to see each
            member&rsquo;s role and work.
          </p>
        </div>
        <TeamGallery members={teamMembers} />
      </div>
    </section>
  );
}
