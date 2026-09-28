import hengLeapPhoto from "../components/about/image/HengLeap.png";
import longhuyPhoto from "../components/about/image/Longhuy.jpg";
import mentorPhoto from "../components/about/image/Mentor.PNG";
import panhaPhoto from "../components/about/image/Panha.JPG";
import pinLeaderPhoto from "../components/about/image/Pin-Leader.JPG";
import raguelPhoto from "../components/about/image/Raguel.png";
import seavminhPhoto from "../components/about/image/Seavminh.jpg";
import type { StaticImageData } from "next/image";

export type ProfileLink = { label: string; href: string };

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;

  photo: StaticImageData | string | null;
  links: ProfileLink[];
};

export const teamMembers: TeamMember[] = [
  {
    id: "kim-sreypin",
    name: "Kim Sreypin",
    role: "Home Page Developer",
    bio: "Developed the main landing page and its overall content and layout. Worked on the hero section, featured attractions, popular provinces, categories, CTA, and attraction search functionality.",
    photo: pinLeaderPhoto,
    links: [
      { label: "GitHub", href: "https://github.com/SreypinKim-pixel" },
      { label: "Telegram", href: "https://t.me/cheriebyn" },
    ],
  },
  {
    id: "leang-seavminh",
    name: "Leang Seavminh",
    role: "Sign Up Page Developer",
    bio: "Developed the user Registration / Sign Up page. Worked on the registration form, input fields, buttons, basic form validation, and API integration.",
    photo: seavminhPhoto,
    links: [
      { label: "GitHub", href: "https://github.com/seavminhleang-art" },
      { label: "Telegram", href: "https://t.me/puthea_reach" },
    ],
  },
  {
    id: "keo-hengleap",
    name: "Keo Hengleap",
    role: "Login Page Developer",
    bio: "Developed the user Login page. Worked on the login form, input fields, buttons, basic form validation, and API integration.",
    photo: hengLeapPhoto,
    links: [
      { label: "GitHub", href: "https://github.com/keohengleap" },
      { label: "Telegram", href: "https://t.me/KeoHengLeap" },
    ],
  },
  {
    id: "sok-chanpanha",
    name: "Sok Chanpanha",
    role: "Navbar & Footer Developer",
    bio: "Developed the website's navigation bar and footer. Ensured navigation links are consistent across all pages and the layout is responsive. Added navigation to Home, Attractions, Provinces, About, Login, and Sign Up.",
    photo: panhaPhoto,
    links: [
      { label: "GitHub", href: "https://github.com/Chanpanha-sok" },
      { label: "Telegram", href: "https://t.me/khmengkomrora" },
    ],
  },
  {
    id: "koem-longhuy",
    name: "Koem Longhuy",
    role: "Custom 404 Page Developer",
    bio: "Developed the custom 404 Error page. Created a clear and user-friendly design for pages that cannot be found and added Back Home / Explore Attractions navigation.",
    photo: longhuyPhoto,
    links: [
      { label: "GitHub", href: "https://github.com/LonghuyKoem" },
      { label: "Telegram", href: "https://t.me/Bro_huy" },
    ],
  },
  {
    id: "chhom-nadaraguel",
    name: "Chhom Nadaraguel",
    role: "About Page Developer",
    bio: "Developed the About page. Worked on the project information, website purpose, team section, and Popular Provinces / Explore Cambodia section using the provinces API.",
    photo: raguelPhoto,
    links: [
      { label: "GitHub", href: "https://github.com/raguelkh-eng" },
      { label: "Telegram", href: "https://t.me/HAVERTZ_CHHOM" },
    ],
  },
];

export const teamSection = {
  eyebrow: "The people behind Vireyak",
  title: "Meet the team.",
  description:
    "Six students built this platform together — design, development, data, content, and testing.",
  mentorTitle: "Guided along the way",
  mentorDescription:
    "Our mentor reviews the work at every stage and keeps the project focused on real travelers.",
  membersTitle: "The team",
};

export const mentor: TeamMember = {
  id: "mentor",
  name: "Srorng Sokcheat",
  role: "Project Mentor",
  bio: "Guides the team through scope, architecture, and presentation, and reviews each release before it reaches the Vireyak catalogue.",
  photo: mentorPhoto,
  links: [
    { label: "GitHub", href: "https://github.com/CheatDev07" },
    { label: "Telegram", href: "https://t.me/Sokcheat_srorng" },
  ],
};
