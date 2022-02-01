import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "remix";
import type { MetaFunction } from "remix";
import { useEffect, useState } from "react";
import { Profile } from "./profile";
import { AuthContext } from "./contexts/auth";

export const meta: MetaFunction = () => {
  return { title: "New Remix App" };
};

export default function App() {
  const [profile, setProfile] = useState<null | Profile>(null);
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);

  useEffect(() => {
    try {
      const access_token = localStorage.getItem("access_token");
      const refresh_token = localStorage.getItem("access_token");
      const profile = JSON.parse(localStorage.getItem("profile") as string);
      console.log({
        access_token,
        refresh_token,
        profile,
      });
      if (access_token && refresh_token && profile?.email) {
        setIsSignedIn(true);
        setProfile({ email: profile.email });
      }
    } catch (err) {}
  }, []);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <AuthContext.Provider
          value={{
            isSignedIn,
            profile,
            setIsSignedIn,
            setProfile,
          }}
        >
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              {isSignedIn ? (
                <>
                  <Link to="/oauth/logout">Sign Out</Link>
                  {" | "}
                  <span>{profile?.email}</span>
                </>
              ) : (
                <Link to="/oauth/login">Sign In</Link>
              )}
            </li>
          </ul>
          <Outlet />
          <ScrollRestoration />
          <Scripts />
          {process.env.NODE_ENV === "development" && <LiveReload />}
        </AuthContext.Provider>
      </body>
    </html>
  );
}
