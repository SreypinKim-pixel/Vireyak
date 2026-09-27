import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import ReviewCard from "./reviews/ReviewCard";
import { reviews } from "./reviews/reviews";

export default function TravelerReviews() {
  return (
    <section
      aria-labelledby="traveler-reviews-heading"
      className="bg-panel py-12 sm:py-16"
    >
      <div className="shell">
        <Reveal>
          <SectionHeading
            id="traveler-reviews-heading"
            eyebrow="Traveler Stories"
            title="What Travelers Say"
            description="A little inspiration for your next Cambodian adventure."
            centered
          >
            {null}
          </SectionHeading>
        </Reveal>
        <div className="mt-10 grid auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <Reveal
              key={review.id}
              delay={(index % 3) * 0.08}
              className="h-full"
            >
              <ReviewCard review={review} />
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-ink/55">
          Sample traveler stories · Names, avatars and reviews are for
          demonstration.
        </p>
      </div>
    </section>
  );
}
