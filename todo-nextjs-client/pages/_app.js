import { useEffect, useMemo, useState } from "react";
import { AuthContext } from "../shared/context/auth";
import BaseLayout from "../shared/layouts/Base";
import qs from "qs";

function MyApp({ Component, pageProps }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState(null);

  const authorizeEndpoint = useMemo(() => {
    const params = {
      response_type: "code",
      client_id: process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID,
      scope: process.env.NEXT_PUBLIC_OAUTH_SCOPE,
      redirect_uri: process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URI,
    };
    return `${process.env.NEXT_PUBLIC_OAUTH_AUTHORIZE_ENDPOINT}?${qs.stringify(
      params
    )}`;
  }, []);

  useEffect(() => {
    try {
      const rawProfile = localStorage.getItem("profile");
      if (rawProfile) {
        setProfile(JSON.parse(rawProfile));
        setIsLoggedIn(true);
      }
    } catch (err) {}
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        profile,
        setProfile,
        authorizeEndpoint,
      }}
    >
      <BaseLayout>
        <Component {...pageProps} />
      </BaseLayout>
    </AuthContext.Provider>
  );
}

export default MyApp;
