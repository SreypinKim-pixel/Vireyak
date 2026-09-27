// Attractions explicitly removed from the site's catalogue by the site owner.
const hiddenAttractionIds = new Set([
  70, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 173, 174, 175, 176, 177,
  178, 179, 180, 202, 205, 206, 207, 208, 212, 217, 218, 219, 220, 223, 226,
  228, 229, 230, 235, 236, 237, 238, 239, 240, 249, 250,
]);

export function isVisibleAttraction(id: string | number) {
  return !hiddenAttractionIds.has(Number(id));
}
