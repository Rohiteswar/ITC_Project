"use client";

import { useAuth } from "react-oidc-context";
import { CSSProperties, useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import from 'next/navigation'

export default function App() {
  const auth = useAuth();
  const router = useRouter(); // Correct import for Next.js 13+
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    if (auth.isAuthenticated && auth.user) {
      const groups = auth.user?.profile["cognito:groups"] as
        | string[]
        | undefined;

      if (groups) {
        if (groups.includes("admin")) {
          setUserType("admin");
        } else if (groups.includes("users")) {
          setUserType("users");
        }
      }
    }
  }, [auth]);

  useEffect(() => {
    if (userType) {
      if (userType === "admin") {
        router.push("/admin/dashboard");
      } else if (userType === "users") {
        router.push("/user/dashboard");
      }
    }
  }, [userType, router]);

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  if (auth.isAuthenticated) {
    return (
      <div>
        <h1>Welcome, {auth.user?.profile.email}</h1>
        <button onClick={() => auth.removeUser()}>Sign out</button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
    <div style={styles.content}>
      <h1 style={styles.title}>Welcome to the Library Management System</h1>
      <button style={styles.button} onClick={() => auth.signinRedirect()}>
        Sign in
      </button>
    </div>
  </div>
  );
}


const styles: {
  container: CSSProperties;
  content: CSSProperties;
  title: CSSProperties;
  button: CSSProperties;
} = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f5f5f5",
  },
  content: {
    textAlign: "center",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "20px",
    color: "#333",
  },
  button: {
    padding: "10px 20px",
    fontSize: "1rem",
    color: "#fff",
    backgroundColor: "#007BFF",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
};