import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { url } = await request.json();
  if (!url || typeof url !== "string") {
    return Response.json({ error: "URL is required" }, { status: 400 });
  }

  // Validate that it looks like a Google Maps URL
  const isGmapsUrl =
    url.includes("maps.app.goo.gl") ||
    url.includes("goo.gl/maps") ||
    url.includes("google.com/maps") ||
    url.includes("maps.google.com");

  if (!isGmapsUrl) {
    return Response.json(
      { error: "URL harus berupa link Google Maps" },
      { status: 400 }
    );
  }

  try {
    // Step 1: Resolve short URL by following redirects
    // We need to get the final URL after all redirects
    const resolved = await fetch(url, {
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) ApleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });
    const finalUrl = resolved.url;

    let lat: number | null = null;
    let lng: number | null = null;
    let name: string | null = null;

    // Step 2: Extract coordinates from the resolved URL
    // Pattern 1: /@lat,lng,zoom
    const atMatch = finalUrl.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (atMatch) {
      lat = parseFloat(atMatch[1]);
      lng = parseFloat(atMatch[2]);
    }

    // Pattern 2: !3d(lat)!4d(lng)
    if (lat === null || lng === null) {
      const dMatch = finalUrl.match(/!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/);
      if (dMatch) {
        lat = parseFloat(dMatch[1]);
        lng = parseFloat(dMatch[2]);
      }
    }

    // Pattern 3: ?q=lat,lng or &q=lat,lng
    if (lat === null || lng === null) {
      const qMatch = finalUrl.match(/[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
      if (qMatch) {
        lat = parseFloat(qMatch[1]);
        lng = parseFloat(qMatch[2]);
      }
    }

    // Pattern 4: /search/lat,lng
    if (lat === null || lng === null) {
      const searchMatch = finalUrl.match(
        /\/search\/(-?\d+\.?\d*),(-?\d+\.?\d*)/
      );
      if (searchMatch) {
        lat = parseFloat(searchMatch[1]);
        lng = parseFloat(searchMatch[2]);
      }
    }

    // Step 3: Extract place name from /place/Name+Of+Place/
    const placeMatch = finalUrl.match(/\/place\/([^/@]+)/);
    if (placeMatch) {
      name = decodeURIComponent(placeMatch[1].replace(/\+/g, " "));
    }

    // Step 4: Try to get name from HTML title as fallback
    if (!name) {
      try {
        const html = await resolved.text();
        const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
        if (titleMatch) {
          let title = titleMatch[1]
            .replace(/ - Google Maps$/i, "")
            .replace(/ - Google マップ$/i, "")
            .replace(/ · Google Maps$/i, "")
            .trim();
          if (title && title !== "Google Maps" && title.length > 0) {
            name = title;
          }
        }
      } catch {
        // Ignore HTML parsing errors
      }
    }

    // Also try fetching the page HTML separately if we still don't have a name
    if (!name) {
      try {
        const pageRes = await fetch(finalUrl, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0 Safari/537.36",
            "Accept-Language": "id-ID,id;q=0.9,en;q=0.8",
          },
        });
        const html = await pageRes.text();
        const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
        if (titleMatch) {
          let title = titleMatch[1]
            .replace(/ - Google Maps$/i, "")
            .replace(/ - Google マップ$/i, "")
            .replace(/ · Google Maps$/i, "")
            .trim();
          if (title && title !== "Google Maps" && title.length > 0) {
            name = title;
          }
        }

        // Also try to extract from meta og:title
        if (!name) {
          const ogMatch = html.match(
            /<meta[^>]*property="og:title"[^>]*content="([^"]*)"[^>]*>/i
          );
          if (ogMatch) {
            let ogTitle = ogMatch[1]
              .replace(/ - Google Maps$/i, "")
              .trim();
            if (ogTitle && ogTitle !== "Google Maps") {
              name = ogTitle;
            }
          }
        }
      } catch {
        // Ignore
      }
    }

    if (lat === null || lng === null) {
      return Response.json(
        {
          error:
            "Tidak dapat mengekstrak koordinat dari URL. Pastikan link Google Maps valid.",
        },
        { status: 400 }
      );
    }

    // Validate coordinate ranges
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return Response.json(
        { error: "Koordinat tidak valid" },
        { status: 400 }
      );
    }

    return Response.json({
      lat,
      lng,
      name: name || "",
      resolvedUrl: finalUrl,
    });
  } catch (error) {
    console.error("Error resolving Google Maps URL:", error);
    return Response.json(
      { error: "Gagal memproses URL Google Maps. Periksa koneksi internet." },
      { status: 500 }
    );
  }
}