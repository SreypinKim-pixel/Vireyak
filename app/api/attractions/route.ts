import { attractions } from "../../../data/travel";
export function GET() {
  return Response.json({ data: attractions, demo: true });
}
