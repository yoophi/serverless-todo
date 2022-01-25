import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAuth } from "../shared/context/auth";

const LogoutPage = () => {
  const { setIsLoggedIn, setProfile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    ["access_token", "refresh_token", "profile"].forEach((key) =>
      localStorage.removeItem(key)
    );
    setIsLoggedIn(false);
    setProfile(null);
    router.push("/");
  }, [setIsLoggedIn, setProfile, router]);

  return <div></div>;
};

export default LogoutPage;
