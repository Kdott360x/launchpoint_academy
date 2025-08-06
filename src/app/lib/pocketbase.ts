// lib/pocketbase.ts
import PocketBase from "pocketbase";

const POCKETBASE_URL =
  process.env.NEXT_PUBLIC_POCKETBASE_URL || "http://127.0.0.1:8090";

const pb =
  typeof window !== "undefined"
    ? new PocketBase(POCKETBASE_URL)
    : new PocketBase(POCKETBASE_URL);

export default pb;
