/**
 * Seed script — creates initial admin user
 * Run: npx tsx src/db/seed.ts
 */
import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "sqlite.db");
const sqlite = new Database(dbPath);

// We'll use the Better Auth API to create the admin user
// First, let's ensure the tables exist by importing auth
async function seed() {
  try {
    // Use fetch to call the signup endpoint
    const baseUrl = process.env.BETTER_AUTH_URL || "http://localhost:3000";

    console.log("🌱 Seeding admin user...");
    console.log("⚠️  Make sure the dev server is running at", baseUrl);

    const response = await fetch(`${baseUrl}/api/auth/sign-up/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Origin": baseUrl },
      body: JSON.stringify({
        name: "Admin Manager",
        email: "admin@indogrosir.com",
        password: "admin123",
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.log("Response:", text);

      // If user already exists, that's fine
      if (text.includes("already") || text.includes("exist")) {
        console.log("✅ Admin user already exists.");
      } else {
        console.error("❌ Failed to create admin user:", response.status, text);
      }
    } else {
      const data = await response.json();
      console.log("✅ Admin user created:", data.user?.email || data);

      // Now update the role to ADMIN directly in the database
      sqlite.prepare("UPDATE user SET role = 'ADMIN' WHERE email = ?").run(
        "admin@indogrosir.com"
      );
      console.log("✅ Admin role set to ADMIN");
    }

    // Create sample deliman users
    const delimanUsers = [
      { name: "Budi (Deliman)", email: "budi@indogrosir.com", password: "budi1234" },
      { name: "Andi (Deliman)", email: "andi@indogrosir.com", password: "andi1234" },
    ];

    for (const u of delimanUsers) {
      const res = await fetch(`${baseUrl}/api/auth/sign-up/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Origin": baseUrl },
        body: JSON.stringify(u),
      });

      if (res.ok) {
        console.log(`✅ Created user: ${u.email}`);
      } else {
        const text = await res.text();
        if (text.includes("already") || text.includes("exist")) {
          console.log(`✅ User ${u.email} already exists.`);
        } else {
          console.log(`⚠️  Could not create ${u.email}:`, text);
        }
      }
    }

    console.log("\n🎉 Seeding complete!");
    console.log("Admin login: admin@indogrosir.com / admin123");
    console.log("User login:  budi@indogrosir.com / budi1234");
    console.log("User login:  andi@indogrosir.com / andi1234");
  } catch (error) {
    console.error("❌ Seed error:", error);
    console.log("Make sure the dev server is running: npm run dev");
  }

  sqlite.close();
}

seed();
