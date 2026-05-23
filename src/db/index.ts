import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

const databaseUrl = process.env.TURSO_DATABASE_URL ?? process.env.DATABASE_URL;
const databaseAuthToken =
  process.env.TURSO_AUTH_TOKEN ?? process.env.DATABASE_AUTH_TOKEN;

const client = createClient(
  databaseUrl
    ? {
        url: databaseUrl,
        authToken: databaseAuthToken,
      }
    : {
        url: "file:sqlite.db",
      }
);


export const db = drizzle(client, { schema });