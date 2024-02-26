/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_URL: "http://localhost:3000",
    MONGO_URL:
      "mongodb+srv://gokturkturan:gktrktrn7635@gokturkturan.i5cpvmh.mongodb.net/nextroom?retryWrites=true",
    NEXTAUTH_SECRET: "secretsecret",
    NEXTAUTH_URL: "http://localhost:3000",
    EMAIL_FROM: "gktrktrn673@gmail.com",
    REPLY_TO: "gktrktrn673@gmail.com",
    AWS_ACCESS_KEY_ID: "AKIAWPZAQMVOLNMIUOZM",
    AWS_SECRET_ACCESS_KEY_ID: "cPpIvR5F+FbhZC880I5cn+cQJx5UrjLqUNLgfyZI",
  },
};

export default nextConfig;
