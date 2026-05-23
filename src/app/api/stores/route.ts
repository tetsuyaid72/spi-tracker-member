import { auth } from "@/lib/auth";
import { db } from "@/db";
import { stores } from "@/db/schema";
import { or, eq } from "drizzle-orm";

import { headers } from "next/headers";
import { nanoid } from "./utils";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userRole = (session.user as any).role || "USER";

    const lightweightColumns = {
    id: stores.id,
    name: stores.name,
    region: stores.region,
    whatsapp: stores.whatsapp,
    lat: stores.lat,
    lng: stores.lng,
    userId: stores.userId,
    userName: stores.userName,
    recordedAt: stores.recordedAt,
    status: stores.status,
  };

  const visibleStores =
    userRole === "ADMIN"
      ? await db.select(lightweightColumns).from(stores)
      : await db
          .select(lightweightColumns)
          .from(stores)
          .where(or(eq(stores.status, "APPROVED"), eq(stores.userId, session.user.id)));

  const result = visibleStores.map((s) => ({
    ...s,
    imageData: "",
    recordedAt: s.recordedAt instanceof Date ? s.recordedAt.getTime() : Number(s.recordedAt),
    status: s.status || "APPROVED",
  }));

  return Response.json(result, {
    headers: {
      "Cache-Control": "private, max-age=15, stale-while-revalidate=45",
    },
  });

}

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, region, whatsapp, imageData, lat, lng } = body;

  if (!name || lat === undefined || lng === undefined) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const userRole = (session.user as any).role || "USER";

  const newStore = {
    id: nanoid(),
    name,
    region: region || "",
    whatsapp: whatsapp || "",
    imageData: imageData || "",
    lat,
    lng,
    userId: session.user.id,
    userName: session.user.name,
    recordedAt: new Date(),
    // Admin-created stores are auto-approved, user stores are pending
    status: userRole === "ADMIN" ? "APPROVED" : "PENDING",
  };

  await db.insert(stores).values(newStore);

  return Response.json({
    ...newStore,
    recordedAt: newStore.recordedAt.getTime(),
  }, { status: 201 });
}
