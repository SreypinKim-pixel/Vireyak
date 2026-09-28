import { attractions } from "../../../data/travel";
import { provinces } from "../../../lib/provinces";

export function GET() {
  return Response.json({
    data: attractions.map((attraction, index) => ({
      ...attraction,
      numericId: index + 1,
      province: provinces.find(
        (province) => province.destination === attraction.destination,
      ),
    })),
    demo: true,
  });
}
