import { SessionPayload } from "@/data/auth/definitions";
import { getSession } from "@/data/auth/stateless-session";
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";

interface SessionContextProps {
  session: SessionPayload | null;
  setSession: React.Dispatch<React.SetStateAction<SessionPayload | null>>;
}

const SessionContext = createContext<SessionContextProps | undefined>(
  undefined
);

interface SessionProviderProps {
  children: ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({
  children,
}) => {
  const [session, setSession] = useState<SessionPayload | null>(null);

  useEffect(() => {
    async function retrieveSession() {
      const sessionData = await getSession();
      setSession(sessionData || null);
    }

    retrieveSession();
  }, []);

  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = (): SessionContextProps => {
  const context = useContext(SessionContext);
  if (!context)
    throw new Error("useSession must be used within a SessionProvider");

  return context;
};
