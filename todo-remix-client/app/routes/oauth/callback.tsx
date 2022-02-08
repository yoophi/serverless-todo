import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoaderFunction, useLoaderData } from "remix";
import { useAuth } from "~/contexts/auth";

export let loader: LoaderFunction = async ({ request }) => {
  let url = new URL(request.url);
  let code = url.searchParams.get("code");

  try {
    const resp = await axios.post(`${process.env.BASE_URI}/api/oauth/token`, {
      grant_type: "authorization_code",
      code,
    });

    return resp.data;
  } catch (err) {
    console.log({ err });
    return {};
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
