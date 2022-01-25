import axios from "axios";
import qs from "qs";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(404);

  const clientId = process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID;
  const tokenEndpoint = process.env.NEXT_PUBLIC_OAUTH_TOKEN_ENDPOINT;
  const scope = process.env.NEXT_PUBLIC_OAUTH_SCOPE;
  const redirectUri = process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URI;

  if (!clientId || !tokenEndpoint || !scope || !redirectUri)
    return res.status(401);

  const { code, grant_type } = req.body;
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  let params;
  if (grant_type === "authorization_code") {
    params = {
      grant_type: grant_type,
      code,
      client_id: clientId,
      scope,
      redirect_uri: redirectUri,
    };
  } else {
    params = {
      token: req.body.refresh_token,
    };
  }

  try {
    const resp = await axios.post(tokenEndpoint, qs.stringify(params), {
      headers,
    });
    res.status(resp.status).json(resp.data);
  } catch (err) {
    console.log(err);
    res.json({ message: "error" });
  }
}
