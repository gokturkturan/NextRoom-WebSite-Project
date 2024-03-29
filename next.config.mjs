/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["nextroom3.s3.eu-north-1.amazonaws.com"],
  },
  env: {
    API_URL: "http://localhost:3000",
    MONGO_URL:
      "mongodb+srv://gokturkturan:gktrktrn7635@gokturkturan.i5cpvmh.mongodb.net/nextroom?retryWrites=true",
    NEXTAUTH_SECRET: "secretsecret",
    NEXTAUTH_URL: "http://localhost:3000",
    EMAIL_FROM: "gktrktrn673@gmail.com",
    REPLY_TO: "gktrktrn673@gmail.com",
    REVALIDATE_TOKEN: "GOKTURKTURAN",
    AWS_ACCESS_KEY_ID: "",
    AWS_SECRET_ACCESS_KEY_ID: "",
    STRIPE_SECRET_KEY: "",
    STRIPE_WEBHOOK_SECRET: "",
  },
};

export default nextConfig;
