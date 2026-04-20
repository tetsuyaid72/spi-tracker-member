import { auth } from "@/lib/auth";
import { db } from "@/db";
import { stores } from "@/db/schema";
import { eq } from "drizzle-orm";
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

  let allStores;
  if (userRole === "ADMIN") {
    // Admin sees everything
    allStores = await db.select().from(stores);
  } else {
    // User sees: ALL approved stores + their own pending/rejected stores
    const allRows = await db.select().from(stores);
    allStores = allRows.filter(
      (s) => s.status === "APPROVED" || s.userId === session.user.id
    );
  }

  // Convert timestamps to numbers for frontend compatibility
  const result = allStores.map((s) => ({
    ...s,
    recordedAt: s.recordedAt instanceof Date ? s.recordedAt.getTime() : Number(s.recordedAt),
    status: s.status || "APPROVED", // fallback for legacy rows
  }));

  return Response.json(result);
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
