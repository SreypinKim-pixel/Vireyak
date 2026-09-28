import { attractions } from "../data/travel";

import { provinceNames } from "../data/province-names";

export const provinces = provinceNames.map((name) => ({
  id: name.toLowerCase().replaceAll(" ", "-"),
  name,
  destination: name === "Preah Sihanouk" ? "Koh Rong" : name,
}));

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
