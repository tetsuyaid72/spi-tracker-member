import { auth } from "@/lib/auth";
import { db } from "@/db";
import { stores } from "@/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  // Find the store
  const existing = await db
    .select()
    .from(stores)
    .where(eq(stores.id, id))
    .limit(1);

  if (existing.length === 0) {
    return Response.json({ error: "Store not found" }, { status: 404 });
  }

  const store = existing[0];
  const userRole = (session.user as any).role || "USER";

  // Only the owner or admin can update
  if (store.userId !== session.user.id && userRole !== "ADMIN") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const updates: Record<string, any> = {};
  if (body.name !== undefined) updates.name = body.name;
  if (body.region !== undefined) updates.region = body.region;
  if (body.whatsapp !== undefined) updates.whatsapp = body.whatsapp;
  if (body.imageData !== undefined) updates.imageData = body.imageData;

  // Only admin can change status (approve/reject)
  if (body.status !== undefined) {
    if (userRole !== "ADMIN") {
      return Response.json({ error: "Only admin can change store status" }, { status: 403 });
    }
    if (!["PENDING", "APPROVED", "REJECTED"].includes(body.status)) {
      return Response.json({ error: "Invalid status value" }, { status: 400 });
    }
    updates.status = body.status;
  }

  if (Object.keys(updates).length > 0) {
    await db.update(stores).set(updates).where(eq(stores.id, id));
  }

  const updated = await db
    .select()
    .from(stores)
    .where(eq(stores.id, id))
    .limit(1);

  const result = updated[0];

  return Response.json({
    ...result,
    recordedAt: result.recordedAt instanceof Date ? result.recordedAt.getTime() : Number(result.recordedAt),
    status: result.status || "APPROVED",
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Find the store
  const existing = await db
    .select()
    .from(stores)
    .where(eq(stores.id, id))
    .limit(1);

  if (existing.length === 0) {
    return Response.json({ error: "Store not found" }, { status: 404 });
  }

  const store = existing[0];
  const userRole = (session.user as any).role || "USER";

  // Only the owner or admin can delete
  if (store.userId !== session.user.id && userRole !== "ADMIN") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  await db.delete(stores).where(eq(stores.id, id));

  return Response.json({ success: true });
}
