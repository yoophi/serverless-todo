import React from "react";
import Link from "next/link";
import { useAuth } from "../context/auth";

const BaseLayout = ({ children }) => {
  const { isLoggedIn, profile, authorizeEndpoint } = useAuth();

  return (
    <div>
      <ul>
        <li>Home</li>

        <li>
          {isLoggedIn ? (
            <Link href="/logout">
              <a>Logout</a>
            </Link>
          ) : (
            <Link href={authorizeEndpoint}>
              <a>Login</a>
            </Link>
          )}
        </li>
        <li>
          <Link href="/settings">
            <a>Settings</a>
          </Link>
        </li>
      </ul>
      <pre>{JSON.stringify({ profile }, null, 2)}</pre>
      <hr />
      {children}
    </div>
  );
};

export default BaseLayout;
