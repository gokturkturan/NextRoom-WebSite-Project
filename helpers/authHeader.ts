import { cookies } from "next/headers";

export const getAuthHeader = () => {
  const nextCookies = cookies();
  const cookieName = "next-auth.session-token";

  const nextAuthSessionToken = nextCookies.get(cookieName);

  return {
    headers: {
      Cookie: `${nextAuthSessionToken?.name}=${nextAuthSessionToken?.value}`,
    },
  };
};
