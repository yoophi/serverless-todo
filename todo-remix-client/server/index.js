const path = require("path");
const express = require("express");
const compression = require("compression");
const morgan = require("morgan");
const { createRequestHandler } = require("@remix-run/express");
const axios = require("axios");
const qs = require("qs");
const jwt_decode = require("jwt-decode");

const MODE = process.env.NODE_ENV;
const BUILD_DIR = path.join(process.cwd(), "server/build");

const app = express();
app.use(compression());
app.use(express.json());

app.post("/api/oauth/token", async (req, res) => {
  const { code, grant_type } = req.body;
  const tokenEndpoint = process.env.OAUTH_TOKEN_ENDPOINT;
  if (typeof tokenEndpoint !== "string") {
    return false;
  }

  const params = qs.stringify({
    client_id: process.env.OAUTH_CLIENT_ID,
    grant_type,
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
    const { email } = jwt_decode(id_token);
    const profile = { email };

    res.json({ ...resp.data, profile });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "sever error" });
  }
});

// You may want to be more aggressive with this caching
app.use(express.static("public", { maxAge: "1h" }));

// Remix fingerprints its assets so we can cache forever
app.use(express.static("public/build", { immutable: true, maxAge: "1y" }));

app.use(morgan("tiny"));
app.all(
  "*",
  MODE === "production"
    ? createRequestHandler({ build: require("./build") })
    : (req, res, next) => {
        purgeRequireCache();
        const build = require("./build");
        return createRequestHandler({ build, mode: MODE })(req, res, next);
      }
);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});

////////////////////////////////////////////////////////////////////////////////
function purgeRequireCache() {
  // purge require cache on requests for "server side HMR" this won't let
  // you have in-memory objects between requests in development,
  // alternatively you can set up nodemon/pm2-dev to restart the server on
  // file changes, we prefer the DX of this though, so we've included it
  // for you by default
  for (const key in require.cache) {
    if (key.startsWith(BUILD_DIR)) {
      delete require.cache[key];
    }
  }
}
