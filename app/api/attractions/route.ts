import { attractions } from "../../../data/travel";
import { provinces } from "../../../lib/provinces";

export function GET() {
  return Response.json({
    data: attractions.map((attraction) => ({
      ...attraction,
      province: provinces.find(
        (province) => province.destination === attraction.destination,
      ),
    })),
    demo: true,
  });
}
