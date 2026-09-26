import { getProvinceAttractions } from "../../../../../lib/provinces";
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const result = getProvinceAttractions((await params).id);
  if (!result)
    return Response.json({ error: "Province not found" }, { status: 404 });
  return Response.json({ ...result, demo: true });
}
