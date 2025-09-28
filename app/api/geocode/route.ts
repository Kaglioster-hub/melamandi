export const runtime = "edge";

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();
  if (q.length < 5) return json([]);

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("limit", "5");
  url.searchParams.set("countrycodes", "it");
  url.searchParams.set("q", q);

  const res = await fetch(url.toString(), {
    headers: { "User-Agent": "MelaMandi/1.0 (melamandi@vrabo.it)" },
    next: { revalidate: 0 },
  });
  if (!res.ok) return json([]);

  const raw = await res.json();
  const items = (raw ?? []).map((r: any) => ({
    id: r.place_id,
    label: r.display_name,
    lat: r.lat, lon: r.lon,
    street: r.address?.road || r.address?.pedestrian || r.address?.footway || "",
    houseNumber: r.address?.house_number || "",
    town: r.address?.city || r.address?.town || r.address?.village || r.address?.hamlet || "",
    cap: r.address?.postcode || "",
    province: r.address?.state || r.address?.county || "",
  }));
  return json(items);
}