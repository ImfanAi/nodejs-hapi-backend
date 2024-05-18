import dotenv from "dotenv";

dotenv.config();
export default {
  mongoURI: process.env.DATABASE_URI,
  jwtSecret: process.env.JWT_SECRET,
  apiVersion: process.env.API_VERSION,
  sumsubToken: process.env.SUMSUB_TOKEN,
  sumsubSecret: process.env.SUMSUB_SECRET,
  venlyclientId: process.env.VENLY_CLIENT_ID,
  venlyclientSecret: process.env.VENLY_CLIENT_SECRET,
  coinpaymentKey: process.env.COINPAYMENT_KEY,
  coinpaymentSecret: process.env.COINPAYMENT_SECRET,
};
