export interface Review {
  id: number;
  name: string;
  date: string;
  rating: number;
  destination: string;
  review: string;
  avatar: string;
}

export const reviews: Review[] = [
  {
    id: 1,
    name: "Sofia M.",
    date: "2 days ago",
    rating: 5,
    destination: "Angkor Wat, Siem Reap",
    review:
      "Watching the sunrise over the temple was unforgettable. Our guide shared stories that made every carving feel alive.",
    avatar: "/assets/reviews/sofia.svg",
  },
  {
    id: 2,
    name: "James R.",
    date: "1 week ago",
    rating: 5,
    destination: "Royal Palace, Phnom Penh",
    review:
      "Beautiful courtyards and incredible architecture. We took our time exploring, then finished with a lovely walk along the riverside.",
    avatar: "/assets/reviews/james.svg",
  },
  {
    id: 3,
    name: "Amelia K.",
    date: "2 weeks ago",
    rating: 5,
    destination: "Koh Rong, Cambodia",
    review:
      "Clear water, soft sand and the most peaceful mornings. Just the little island escape we needed after a busy week.",
    avatar: "/assets/reviews/amelia.svg",
  },
  {
    id: 4,
    name: "Daniel T.",
    date: "3 weeks ago",
    rating: 4,
    destination: "Bayon Temple, Siem Reap",
    review:
      "The stone faces are even more impressive in person. It was busy by midday, but exploring the quieter corners was a highlight.",
    avatar: "/assets/reviews/daniel.svg",
  },
  {
    id: 5,
    name: "Emma L.",
    date: "1 month ago",
    rating: 5,
    destination: "Kampot, Cambodia",
    review:
      "Slow afternoons by the river and wonderful local food. Kampot gave us space to relax and enjoy a different side of Cambodia.",
    avatar: "/assets/reviews/emma.svg",
  },
  {
    id: 6,
    name: "Michael P.",
    date: "1 month ago",
    rating: 5,
    destination: "Phnom Penh, Cambodia",
    review:
      "A memorable mix of markets, history and riverside evenings. We found something interesting around almost every corner.",
    avatar: "/assets/reviews/michael.svg",
  },
];
