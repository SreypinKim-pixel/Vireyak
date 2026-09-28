export const platformName = "Vireyak";

export const aboutHero = {
  eyebrow: "About Vireyak",
  title: "Discover Cambodia",
  titleAccent: `with ${platformName}`,
  description:
    "Vireyak is a Cambodia-first travel platform. We bring provinces, destinations, and visitor information together in one clear place, so planning a trip starts with discovery instead of twenty open browser tabs.",
  image: {
    src: "/images/angkor.jpg",
    alt: "Morning light across the ancient grounds of Angkor Wat in Cambodia",
  },
  overlay: {
    title: "A small country. A world of wonder.",
    copy: "Temples, islands, rivers, and highlands — all in one kingdom.",
  },
  primaryCta: { label: "See featured places", href: "#explore-cambodia" },
  secondaryCta: { label: "Browse experiences", href: "/attraction" },
};

export const aboutIntro = {
  eyebrow: "What we do",
  title: "One platform for Cambodia's destinations.",
  lead: `Every part of ${platformName} exists to answer a single question: what is worth seeing in Cambodia, and how do I find it?`,
  pillars: [
    {
      icon: "search",
      title: "What Vireyak does",
      copy: "Vireyak collects Cambodian provinces, destinations, and visitor information into one searchable catalogue — from the temple cities of the northwest to the quiet waterfalls of the northeast.",
    },
    {
      icon: "users",
      title: "Who it is for",
      copy: "Independent travelers, families, and anyone curious about Cambodia — including the people who already live here and want to see more of their own country.",
    },
    {
      icon: "shield",
      title: "The problem it solves",
      copy: "Information about Cambodian places is scattered across blogs, maps, and agency pages. Vireyak keeps it in one place, in one format, with Khmer and English names side by side.",
    },
    {
      icon: "temple",
      title: "Why Cambodia",
      copy: "Cambodia is compact, welcoming, and astonishingly varied. A single country holds temple complexes, river towns, tropical islands, and highland forest — and much of it is still quietly under-visited.",
    },
  ],
};

export const cambodiaSection = {
  eyebrow: "Cambodia at a glance",
  title: "One country. Four regions. Hundreds of places.",
  description:
    "The Vireyak catalogue is organized the way Cambodia is: by province, and by the region that province belongs to.",
  factsTitle: "Country overview",
  factsNote: "General reference information, not API data.",
  provincesTitle: "Provinces in the catalogue",
};

export const regionDescriptions = {
  NORTHWEST:
    "Angkor, the Tonle Sap plains, and the riverside streets of Battambang.",
  NORTHEAST:
    "Ratanakiri and Mondulkiri highlands, waterfalls, and the upper Mekong.",
  CENTRAL:
    "Phnom Penh, the Mekong lowlands, and the historic heart of the country.",
  COASTAL:
    "Kampot, Kep, Preah Sihanouk, and the islands of the Gulf of Thailand.",
  SOUTHWEST:
    "The Cardamom mountains, Koh Kong, and the southwestern coastline.",
};

export const countryFacts = [
  { label: "Capital", value: "Phnom Penh" },
  { label: "Official language", value: "Khmer" },
  { label: "Currency", value: "Riel (KHR)" },
  { label: "Region", value: "Southeast Asia" },
];

export const placesSection = {
  eyebrow: "Explore Cambodia",
  title: "Places worth a closer look.",
  description:
    "A selection from the live Vireyak catalogue, chosen from the places the API marks as featured.",
  cta: { label: "Browse all experiences", href: "/attraction" },
  emptyTitle: "No places to show just yet.",
  emptyCopy:
    "The catalogue returned an empty list. Our experiences page still has plenty of Cambodian inspiration to explore.",
  errorTitle: "The live catalogue is unavailable.",
  errorCopy:
    "We could not reach the Vireyak API, so here are a few Cambodian destinations from our own guide instead. The live catalogue returns as soon as the API is reachable again.",
  footnote:
    "Names, provinces, categories, and descriptions are returned by the public Vireyak API.",
};

export const whyVireyak = [
  {
    icon: "temple",
    title: "Discover",
    copy: "Explore Cambodian destinations and places, province by province, in a catalogue built for browsing.",
  },
  {
    icon: "spark",
    title: "Experience",
    copy: "Learn what makes each place worth the journey — its region, its category, and its story.",
  },
  {
    icon: "shield",
    title: "Convenience",
    copy: "Useful tourism information for the whole country in one platform, with Khmer and English names together.",
  },
  {
    icon: "users",
    title: "Connection",
    copy: "Help travelers find more of Cambodia, and travel with more understanding of the places they visit.",
  },
];

export const whyVireyakSection = {
  eyebrow: "Why Vireyak",
  title: "Built for the way people travel Cambodia.",
  description:
    "Four ideas shape every part of the platform, from the catalogue to the way places are presented.",
};

export const travelCompass = {
  eyebrow: "Our compass",
  title: "A more meaningful way to go.",
  points: [
    {
      icon: "temple",
      title: "Stay curious",
      copy: "Look beyond the landmark. Take time to learn the story, respect the customs, and connect with the place you are visiting.",
    },
    {
      icon: "leaf",
      title: "Leave a lighter footprint",
      copy: "Take it slowly, bring a reusable bottle, and treat Cambodia’s landscapes with the care they deserve.",
    },
    {
      icon: "heart",
      title: "Keep it local",
      copy: "Seek out local craftsmanship, try something new at a neighborhood table, and let the people you meet shape your journey.",
    },
  ],
};

export const aboutFaqs = {
  eyebrow: "A little clarity before you go",
  title: "Good questions. Honest answers.",
  questions: [
    {
      question: "Can I make a booking on Vireyak?",
      answer:
        "Not yet. Vireyak is currently a discovery preview. You can explore sample stays and experiences, save favorites on your device, and preview a trip. No reservation or payment is made.",
    },
    {
      question: "Where does the place information come from?",
      answer:
        "Province and place details are requested live from the public Vireyak API and cached for a short time. Figures such as the number of provinces or places are calculated from those API responses, not typed in by hand.",
    },
    {
      question: "Are the prices and reviews live?",
      answer:
        "No. Stay and experience listings, prices, ratings, and reviews are illustrative sample content. Destination photographs offer inspiration; they are not verified photographs of the sample properties.",
    },
    {
      question: "Do I need an account to explore?",
      answer:
        "No. Every destination, stay, and experience can be explored without signing in. Account registration and login are previews and are not connected to an authentication service.",
    },
  ],
};

export const finalCta = {
  eyebrow: "One country. Endless possibilities.",
  title: "Ready to explore Cambodia?",
  copy: "Start with the destinations, then find the experiences that fit the way you like to travel.",
  primaryCta: { label: "Explore destinations", href: "/stays" },
  secondaryCta: { label: "Browse experiences", href: "/attraction" },
};
