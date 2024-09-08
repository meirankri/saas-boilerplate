import { Lucia } from "lucia";
import adapter from "./prismaAdapter";
import { cookies } from "next/headers";
import { cache } from "react";
import { ExtendedUser } from "@/types";

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (databaseUserAttributes) => databaseUserAttributes,
});

export const validateSession = cache(async () => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;

  if (!sessionId) {
    return {
      user: null,
      session: null,
    };
  }

  const { user, session } = await lucia.validateSession(sessionId);
  const extendedUser = user as ExtendedUser;

  return {
    user: extendedUser,
    session,
  };
});

export const protectRoute = async (): Promise<{
  status: number;
  body: { message: string };
}> => {
  const { session } = await validateSession();
  if (!session) {
    return {
      status: 401,
      body: { message: "Unauthorized" },
    };
  }
  return {
    status: 200,
    body: { message: "Authorized" },
  };
};

export const getCurrentUser = async (): Promise<ExtendedUser> => {
  const { user } = await validateSession();
  return user;
};

declare module "lucia" {
  interface Context {
    user: ExtendedUser;
  }
  interface Register {
    Lucia: typeof lucia;
    DatabaseAttributes: {
      email: string;
    };
  }
}
