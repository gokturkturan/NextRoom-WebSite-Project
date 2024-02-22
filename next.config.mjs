/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_URL: "http://localhost:3000",
    MONGO_URL:
      "mongodb+srv://gokturkturan:gktrktrn7635@gokturkturan.i5cpvmh.mongodb.net/nextroom?retryWrites=true",
    NEXTAUTH_SECRET: "secretsecret",
    NEXTAUTH_URL: "http://localhost:3000",
    AWS_ACCESS_KEY_ID: "",
    AWS_SECRET_ACCESS_KEY_ID: "",
  },
};

export default nextConfig;
