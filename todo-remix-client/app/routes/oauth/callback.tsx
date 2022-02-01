import axios from "axios";
import qs from "qs";
import React, { useEffect } from "react";
import { LoaderFunction, useLoaderData } from "remix";
import jwt_decode from "jwt-decode";
import { useAuth } from "~/contexts/auth";
import { useNavigate } from "react-router-dom";

export let loader: LoaderFunction = async ({ request }) => {
  let url = new URL(request.url);
  let code = url.searchParams.get("code");

  const tokenEndpoint = process.env.OAUTH_TOKEN_ENDPOINT;
  if (typeof tokenEndpoint !== "string") {
    return false;
  }

  const params = qs.stringify({
    client_id: process.env.OAUTH_CLIENT_ID,
    grant_type: "authorization_code",
    code,
    scope: process.env.OAUTH_SCOPE,
    redirect_uri: process.env.OAUTH_REDIRECT_URI,
  });
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  try {
    const resp = await axios.post(tokenEndpoint, params, { headers });
    const { id_token } = resp.data;
    const { email } = jwt_decode(id_token) as any;
    const profile = { email };

    return { ...resp.data, profile };
  } catch (err) {
    console.error(err);
    return false;
  }
};

function CallbackPage() {
  const resp = useLoaderData<any>();
  const { setIsSignedIn, setProfile } = useAuth();
  let navigate = useNavigate();

  useEffect(() => {
    if (resp) {
      const { access_token, refresh_token, profile } = resp;
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
      localStorage.setItem("profile", JSON.stringify(profile));
      setIsSignedIn(true);
      setProfile(profile);
      navigate("/", { replace: true });
    }
  }, [resp]);

  return <div>Loading ... </div>;
}

export default CallbackPage;
