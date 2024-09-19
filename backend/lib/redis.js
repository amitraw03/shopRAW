import Redis from "ioredis"
import dotenv from "dotenv";

dotenv.config();

export const redis = new Redis(process.env.UPSTASH_REDIS_URL);
// Key-value store  -- Redis is a memory based key-value store
