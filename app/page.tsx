"use client";

import { useUser, SignInButton, SignOutButton } from "@clerk/nextjs";
import { useQuery, useMutation, Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState } from "react";

function AuthenticatedContent() {
  const { user } = useUser();
  const currentUser = useQuery(api.users.getCurrentUser);
  const ensureUserExists = useMutation(api.users.ensureUserExists);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    async function syncUser() {
      if (user && currentUser === null && !isSyncing) {
        setIsSyncing(true);
        try {
          await ensureUserExists({
            clerkId: user.id,
            email: user.emailAddresses[0]?.emailAddress ?? "",
          });
        } catch (error) {
          console.error("Failed to sync user:", error);
        } finally {
          setIsSyncing(false);
        }
      }
    }

    syncUser();
  }, [user, currentUser, ensureUserExists, isSyncing]);

  return (
    <div>
      <h2>Welcome, {user?.emailAddresses[0]?.emailAddress}</h2>
      {currentUser === undefined ? (
        <div>Loading user data...</div>
      ) : currentUser === null ? (
        <div>
          <p>Setting up your account...</p>
        </div>
      ) : (
        <div>
          <p>Role: {currentUser.role}</p>
          {currentUser.jurisdiction && (
            <p>Jurisdiction: {currentUser.jurisdiction}</p>
          )}
          <p>Status: {currentUser.status}</p>
        </div>
      )}
      <SignOutButton />
    </div>
  );
}

function UnauthenticatedContent() {
  return (
    <div>
      <p>Please sign in to continue.</p>
      <SignInButton />
    </div>
  );
}

export default function Home() {
  return (
    <main style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>P-BID Platform</h1>
      <p>PEBEC Business-Investment Direct Platform</p>

      <Authenticated>
        <AuthenticatedContent />
      </Authenticated>
      <Unauthenticated>
        <UnauthenticatedContent />
      </Unauthenticated>
      <AuthLoading>
        <div>Loading authentication...</div>
      </AuthLoading>
    </main>
  );
}

