import dotenv from 'dotenv';
dotenv.config();

export const {
  NODE_ENV,
  PORT,
  JWT_SECRET,
  MONGO_URI,
  MIME_TYPES,
  UPLOAD_PATH,
  NODEMAILER_EMAIL,
  NODEMAILER_PASSWORD,
  NODEMAILER_HOST,
  NODEMAILER_PORT,
  CLIENT_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL,
  FACEBOOK_CLIENT_ID,
  FACEBOOK_CLIENT_SECRET,
  FACEBOOK_CALLBACK_URL,
} = process.env;