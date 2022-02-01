import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "~/contexts/auth";

function SignOutRoute() {
  const { setIsSignedIn, setProfile } = useAuth();
  let navigate = useNavigate();

  useEffect(() => {
    ["access_token", "refresh_token", "profile"].forEach((key) => {
      localStorage.removeItem(key);
    });
    setIsSignedIn(false);
    setProfile(null);
    navigate("/", { replace: true });
  }, []);

  return <div>Loading ...</div>;
}

export default SignOutRoute;
