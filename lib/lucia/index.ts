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

export const validateRequest = cache(async () => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;

  if (!sessionId)
    return {
      user: null,
      session: null,
    };

  const { user, session } = await lucia.validateSession(sessionId);
  let extendedUser: ExtendedUser;
  if (user) {
    extendedUser = user as ExtendedUser;
  }
  try {
    if (session && session.fresh) {
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
    if (!session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
  } catch (e) {
    console.error("Error setting session cookie", e);
  }
  return {
    user: extendedUser,
    session,
  };
});

export const getCurrentUser = async (): Promise<ExtendedUser> => {
  const { user } = await validateRequest();
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
