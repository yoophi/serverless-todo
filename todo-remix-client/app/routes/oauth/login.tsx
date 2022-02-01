import qs from "qs";
import React, { useEffect } from "react";
import { useLoaderData } from "remix";

export async function loader() {
  const authorizationEndpoint = process.env.OAUTH_AUTHORIZE_ENDPOINT;
  const params = {
    client_id: process.env.OAUTH_CLIENT_ID,
    scope: process.env.OAUTH_SCOPE,
    redirect_uri: process.env.OAUTH_REDIRECT_URI,
    response_type: "code",
  };
  const signInUrl = `${authorizationEndpoint}?${qs.stringify(params)}`;

  return { signInUrl };
}

function SignInRoute() {
  const { signInUrl } = useLoaderData<{ signInUrl: string }>();

  useEffect(() => {
    if (signInUrl) {
      window.location.href = signInUrl;
    }
  }, [signInUrl]);

  return (
    <div>
      <span>Redirecting to URL: </span>
      <a href={signInUrl}>{signInUrl}</a>
    </div>
  );
}

export default SignInRoute;
