import { MongoClient, Db } from "mongodb";
import mongoose from "mongoose";
import { env } from "./env";

let mongoClient: MongoClient | null = null;
let nativeDb: Db | null = null;

/**
 * Better Auth's official MongoDB adapter needs a raw `mongodb` driver `Db`
 * instance (not Mongoose). We keep this single native connection around and
 * hand it to `betterAuth()` in `auth.ts`.
 */
export async function connectNativeMongo(): Promise<Db> {
  if (nativeDb) return nativeDb;
  mongoClient = new MongoClient(env.MONGODB_URI);
  await mongoClient.connect();
  nativeDb = mongoClient.db(env.MONGODB_DB_NAME);
  console.log("[db] native MongoDB client connected (used by Better Auth)");
  return nativeDb;
}

/**
 * Mongoose connection used by our own domain models: EmergencyRequest,
 * DonationHistory. Runs alongside the native client above, both pointing at
 * the same database.
 */
export async function connectMongoose(): Promise<typeof mongoose> {
  if (mongoose.connection.readyState === 1) return mongoose;
  await mongoose.connect(env.MONGODB_URI, { dbName: env.MONGODB_DB_NAME });
  console.log("[db] Mongoose connected (used by app models)");
  return mongoose;
}

export async function connectAll() {
  const db = await connectNativeMongo();
  await connectMongoose();
  return db;
}

export async function disconnectAll() {
  await mongoose.disconnect();
  await mongoClient?.close();
}

export function getNativeDb(): Db {
  if (!nativeDb) {
    throw new Error("Native MongoDB not connected yet — call connectAll() first.");
  }
  return nativeDb;
}
