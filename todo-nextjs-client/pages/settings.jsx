import React from "react";

const SettingsPage = () => {
  return (
    <div>
      <ul>
        <li>
          API_BASE: <code>{process.env.NEXT_PUBLIC_API_BASE}</code>
          <li>
            AUTHORIZE_ENDPOINT:{" "}
            <code>{process.env.NEXT_PUBLIC_OAUTH_AUTHORIZE_ENDPOINT}</code>
          </li>
          <li>
            TOKEN_ENDPOINT:{" "}
            <code>{process.env.NEXT_PUBLIC_OAUTH_TOKEN_ENDPOINT}</code>
          </li>
          <li>
            SCOPE: <code>{process.env.NEXT_PUBLIC_OAUTH_SCOPE}</code>
          </li>
          <li>
            CLIENT_ID: <code>{process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID}</code>
          </li>
          <li>
            REDIRECT_URI:{" "}
            <code>{process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URI}</code>
          </li>
        </li>
      </ul>
    </div>
  );
};

export default SettingsPage;
