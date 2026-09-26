import { getProvince } from "@/lib/cam-trip";

// Thin read-only proxy to the teacher CamTrip API. The teacher API does not
// send CORS headers, so the browser calls this same-origin route and the
// request is forwarded server-side to:
//   GET https://cam-trip.cheat.casa/api/provinces/{id}
export async function GET(_request, { params }) {
  const { id } = await params;
  if (!/^\d{1,6}$/.test(id)) {
    return Response.json(
      { error: "Province ID must be a positive integer." },
      { status: 400 },
    );
  }

  try {
    const province = await getProvince(id);
    return Response.json(
      { data: province },
      { status: 200, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (/: 404$/.test(message)) {
      return Response.json(
        { error: "Province not found. Check the ID and try again." },
        { status: 404 },
      );
    }
    console.error("Province lookup failed:", error);
    return Response.json(
      {
        error:
          "The province service is currently unavailable. Please try again later.",
      },
      { status: 502 },
    );
  }
}
