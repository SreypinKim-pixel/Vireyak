// Team and mentor content for the About page.
//
// HOW TO EDIT
// 1. `name`, `role`, and `bio` are plain text: change the wording here and the
//    About page picks it up, with no component changes.
// 2. Photos live in `components/about/image/` and are imported at the top of
//    this file, so the browser receives a hashed, cache-friendly URL. A photo
//    can also be a plain path string for a file in `public/`, for example
//    `photo: "/images/team/member-1.jpg"`. Photos fill their card with
//    `object-cover`, anchored to the top edge (the member panels in the
//    interactive gallery and the mentor card alike), so a portrait shot with the
//    face in the upper half looks best. If `photo` is null — or the file fails to
//    load — the card shows an initials tile instead, so nothing ever breaks.
// 3. Paste each person's profile URLs into the matching `href` below.
//    Example: { label: "GitHub", href: "https://github.com/your-handle" }
//    Example: { label: "Telegram", href: "https://t.me/your-handle" }
//    Empty URLs show the icons without making them clickable.
// 4. `id` is only used as the React key, so keep it stable and unique.

import hengLeapPhoto from "../components/about/image/HengLeap.png";
import longhuyPhoto from "../components/about/image/Longhuy.jpg";
import mentorPhoto from "../components/about/image/Mentor.PNG";
import panhaPhoto from "../components/about/image/Panha.JPG";
import pinLeaderPhoto from "../components/about/image/Pin-Leader.JPG";
import raguelPhoto from "../components/about/image/Raguel.png";
import seavminhPhoto from "../components/about/image/Seavminh.jpg";
import type { StaticImageData } from "next/image";

/** One optional profile link, e.g. { label: "GitHub", href: "https://…" }. */
export type ProfileLink = { label: string; href: string };

/** A person on the About page: one team member, or the mentor. */
export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  /**
   * Bundled portrait — a `StaticImageData` from the imports above — or a plain
   * path string for a file in `public/`. `null` shows the initials placeholder.
   */
  photo: StaticImageData | string | null;
  links: ProfileLink[];
};

// The six members of the project, each wired to the photo in
// `components/about/image/` that matches their name.

export const teamMembers: TeamMember[] = [
  {
    id: "kim-sreypin",
    name: "Kim Sreypin",
    role: "Home Page Developer",
    bio: "Developed the main landing page and its overall content and layout. Worked on the hero section, featured attractions, popular provinces, categories, CTA, and attraction search functionality.",
    photo: pinLeaderPhoto,
    links: [
      { label: "GitHub", href: "" },
      { label: "Telegram", href: "" },
    ],
  },
  {
    id: "leang-seavminh",
    name: "Leang Seavminh",
    role: "Sign Up Page Developer",
    bio: "Developed the user Registration / Sign Up page. Worked on the registration form, input fields, buttons, basic form validation, and API integration.",
    photo: seavminhPhoto,
    links: [
      { label: "GitHub", href: "" },
      { label: "Telegram", href: "" },
    ],
  },
  {
    id: "keo-hengleap",
    name: "Keo Hengleap",
    role: "Login Page Developer",
    bio: "Developed the user Login page. Worked on the login form, input fields, buttons, basic form validation, and API integration.",
    photo: hengLeapPhoto,
    links: [
      { label: "GitHub", href: "" },
      { label: "Telegram", href: "" },
    ],
  },
  {
    id: "sok-chanpanha",
    name: "Sok Chanpanha",
    role: "Navbar & Footer Developer",
    bio: "Developed the website's navigation bar and footer. Ensured navigation links are consistent across all pages and the layout is responsive. Added navigation to Home, Attractions, Provinces, About, Login, and Sign Up.",
    photo: panhaPhoto,
    links: [
      { label: "GitHub", href: "" },
      { label: "Telegram", href: "" },
    ],
  },
  {
    id: "koem-longhuy",
    name: "Koem Longhuy",
    role: "Custom 404 Page Developer",
    bio: "Developed the custom 404 Error page. Created a clear and user-friendly design for pages that cannot be found and added Back Home / Explore Attractions navigation.",
    photo: longhuyPhoto,
    links: [
      { label: "GitHub", href: "" },
      { label: "Telegram", href: "" },
    ],
  },
  {
    id: "chhom-nadaraguel",
    name: "Chhom Nadaraguel",
    role: "About Page Developer",
    bio: "Developed the About page. Worked on the project information, website purpose, team section, and Popular Provinces / Explore Cambodia section using the provinces API.",
    photo: raguelPhoto,
    links: [
      { label: "GitHub", href: "" },
      { label: "Telegram", href: "" },
    ],
  },
];

export const teamSection = {
  eyebrow: "The people behind CamTrip",
  title: "Meet the team.",
  description:
    "Six students built this platform together — design, development, data, content, and testing.",
  mentorTitle: "Guided along the way",
  mentorDescription:
    "Our mentor reviews the work at every stage and keeps the project focused on real travelers.",
  membersTitle: "The team",
};

// Mentor entry, shown in its own larger card *above* the six-member interactive
// gallery, so it reads as the profile the team sits under and stays clear of the
// hover/expand interaction. The portrait is the `Mentor.PNG` bundled next to the
// member photos in `components/about/image/`, imported the same way, so the
// mentor column fills with a real photo instead of the initials placeholder.
export const mentor: TeamMember = {
  id: "mentor",
  name: "Srorng Sokcheat",
  role: "Project Mentor",
  bio: "Guides the team through scope, architecture, and presentation, and reviews each release before it reaches the CamTrip catalogue.",
  photo: mentorPhoto,
  links: [
    { label: "GitHub", href: "" },
    { label: "Telegram", href: "" },
  ],
};
