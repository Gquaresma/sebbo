import { config } from "dotenv";

config();

export const database_url = process.env.DATABASE_URL;
export const jwt_key = process.env.KEY;
export const auth_domain = process.env.AUTH_DOMAIN;
export const api_key = process.env.API_KEY;
export const project_id = process.env.PROJECT_ID;
export const storage_bucket = process.env.STORAGE_BUCKET;
export const messagin_sender_id = process.env.MESSAGING_SENDER_ID;
export const app_id = process.env.APP_ID;
export const measurement_id = process.env.MEASUREMENT_ID
