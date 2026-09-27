// Local copies keyed by API record ID; card content still comes from the API.
const images = {
  "province-1": "/images/destinations/province-1.jpg",
  "attraction-22": "/images/destinations/attraction-22.jpg",
  "province-2": "/images/destinations/province-2.webp",
  "province-3": "/images/destinations/province-3.jpg",
  "attraction-31": "/images/destinations/attraction-31.jpg",
  "attraction-41": "/images/destinations/attraction-41.jpg",
  "attraction-51": "/images/destinations/attraction-51.jpg",
  "attraction-61": "/images/destinations/attraction-61.jpg",
  "attraction-71": "/images/destinations/attraction-71.jpg",
};

export function localDestinationImage(kind, id, remoteUrl) {
  return images[`${kind}-${id}`] || remoteUrl || null;
}
