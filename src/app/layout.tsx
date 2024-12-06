'use client'; // Ensures this component runs on the client side

import { AuthProvider } from "react-oidc-context";

// Configuration for AWS Cognito
const cognitoAuthConfig = {
  authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_dfBZBlV1P", // Cognito authority URL
  client_id: "31ga8qsrf98qssqe2vedn3i0s4", // App client ID
  redirect_uri: "http://localhost:3000", // Redirect URI after sign-in
  response_type: "code", // OAuth 2.0 response type
  scope: "email openid phone", // Scopes required for authentication
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider {...cognitoAuthConfig}>
      <html lang="en">
        <body>{children}</body>
      </html>
    </AuthProvider>
  );
}
