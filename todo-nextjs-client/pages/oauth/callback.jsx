import axios from "axios";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAuth } from "../../shared/context/auth";

const CallbackPage = () => {
  const router = useRouter();
  const { setIsLoggedIn, setProfile } = useAuth();

  useEffect(() => {
    const code = router.query?.code;
    if (code) {
      return axios
        .post("/api/oauth/token", {
          grant_type: "authorization_code",
          code: code,
        })
        .then(async (res) => {
          if (res.data) {
            const { access_token, id_token, refresh_token } = res.data;
            localStorage.setItem("access_token", access_token);
            localStorage.setItem("refresh_token", refresh_token);
            const { email } = jwt_decode(id_token);
            const profile = { email };
            localStorage.setItem("profile", JSON.stringify(profile));
            setIsLoggedIn(true);
            setProfile(profile);

            await router.push("/");
          }
        })
        .catch(async (e) => {
          console.error(e);
          await router.push("/");
        });
    }
  }, [router, setProfile, setIsLoggedIn]);

  return <div></div>;
};

export default CallbackPage;
