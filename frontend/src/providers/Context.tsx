"use client";
import { createContext, useState } from "react";
import { Session } from "../../interface";
export const context = createContext<{
  session: Session | undefined;
  updateSession: (newToken: string) => Promise<void>;
  deleteSession: () => void;
}>({
  session: undefined,
  updateSession: async () => {},
  deleteSession: () => {},
});
export default function ({
  initialSession,
  children,
}: {
  initialSession: Session | undefined;
  children: React.ReactNode;
}) {
  const [session, setSession] = useState(initialSession);

  function deleteSession() {
    setSession(undefined);
  }

  async function updateSession(newToken: string): Promise<void> {
    let newSession: any = {
      token: newToken,
    };
    const response = await fetch("/api/auth/me", {
      method: "GET",
      headers: new Headers({
        Authorization: "Bearer " + newToken,
      }),
    });
    if (response.ok) {
      newSession.user = await response.json();
      setSession(newSession as Session);
    }
  }

  return (
    <context.Provider value={{ session, updateSession, deleteSession }}>
      {children}
    </context.Provider>
  );
}
