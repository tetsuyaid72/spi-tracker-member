import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user, session as sessionTable, account, stores } from "@/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userRole = (session.user as any).role || "USER";

  if (userRole !== "ADMIN") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const allUsers = await db.select({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  }).from(user);

  return Response.json(allUsers);
}

export async function DELETE(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userRole = (session.user as any).role || "USER";
  if (userRole !== "ADMIN") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("id");

  if (!userId) {
    return Response.json({ error: "Missing user id" }, { status: 400 });
  }

  // Prevent admin from deleting themselves
  if (userId === session.user.id) {
    return Response.json({ error: "Tidak dapat menghapus akun Anda sendiri" }, { status: 400 });
  }

  try {
    // Hapus data terkait user (foreign key)
    await db.delete(stores).where(eq(stores.userId, userId));
    await db.delete(sessionTable).where(eq(sessionTable.userId, userId));
    await db.delete(account).where(eq(account.userId, userId));
    await db.delete(user).where(eq(user.id, userId));

  return Response.json({ success: true });
  } catch (err) {
    console.error("Failed to delete user:", err);
    return Response.json({ error: "Gagal menghapus user" }, { status: 500 });
  }
}
