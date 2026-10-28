import "server-only";
import { MongoClient, type Db } from "mongodb";

declare global {
  // Reuse one client across dev hot reloads instead of opening a new pool each time.
  var _mongoClient: Promise<MongoClient> | undefined;
}

function getClient(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set (see .env.example)");
  globalThis._mongoClient ??= new MongoClient(uri).connect().catch((err) => {
    // Don't cache a failed connection; the next request will retry.
    globalThis._mongoClient = undefined;
    throw err;
  });
  return globalThis._mongoClient;
}

export async function getDb(): Promise<Db> {
  const client = await getClient();
  return client.db(process.env.MONGODB_DB || "pollcreate");
}
