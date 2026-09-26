import { attractions } from "../data/travel";

// Demo IDs, not official administrative codes. Koh Rong belongs to Preah Sihanouk.
export const provinces = [
  { id: "siem-reap", name: "Siem Reap", destination: "Siem Reap" },
  { id: "preah-sihanouk", name: "Preah Sihanouk", destination: "Koh Rong" },
  { id: "phnom-penh", name: "Phnom Penh", destination: "Phnom Penh" },
  { id: "kampot", name: "Kampot", destination: "Kampot" },
];
export function getProvinceAttractions(id: string) {
  const province = provinces.find((item) => item.id === id);
  if (!province) return null;
  return {
    province,
    data: attractions.filter(
      (item) => item.destination === province.destination,
    ),
  };
}
