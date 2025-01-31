"use server";
import { lucia, validateSession } from "@/lib/lucia";
import { cookies } from "next/headers";
import { generateCodeVerifier, generateState } from "arctic";
import { facebook, github, google } from "@/lib/lucia/oauth";
import { logger } from "@/utils/logger";
import { checkAndRenewQuotas } from "./quotas";

export const signOut = async () => {
  try {
    const { session } = await validateSession();

    if (!session) {
      return {
        error: "Unauthorized",
      };
    }

    await lucia.invalidateSession(session.id);

    const sessionCookie = lucia.createBlankSessionCookie();

    (await cookies()).set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
  } catch (error: any) {
    logger({
      message: "Failed to sign out",
      context: error,
    }).error();
    return {
      error: error?.message,
    };
  }
};

export const createGoogleAuthorizationURL = async () => {
  try {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();

    (await cookies()).set("codeVerifier", codeVerifier, {
      httpOnly: true,
    });

    (await cookies()).set("state", state, {
      httpOnly: true,
    });

    const authorizationURL = await google.createAuthorizationURL(
      state,
      codeVerifier,
      {
        scopes: ["email", "profile"],
      }
    );

    return {
      success: true,
      data: authorizationURL.toString(),
    };
  } catch (error: any) {
    logger({
      message: "Failed to create Google authorization URL",
      context: error,
    }).error();
    return {
      error: error?.message,
    };
  }
};

export const createGithubAuthorizationURL = async () => {
  try {
    const state = generateState();

    (await cookies()).set("state", state, {
      httpOnly: true,
    });

    const authorizationURL = await github.createAuthorizationURL(state, {
      scopes: ["user:email"],
    });

    return {
      success: true,
      data: authorizationURL.toString(),
    };
  } catch (error: any) {
    logger({
      message: "Failed to create Github authorization URL",
      context: error,
    }).error();
    return {
      error: error?.message,
    };
  }
};

export const createFacebookAuthorizationURL = async () => {
  try {
    const state = generateState();

    const authorizationURL = await facebook.createAuthorizationURL(state, {
      scopes: ["email", "public_profile"],
    });

    return {
      success: true,
      data: authorizationURL.toString(),
    };
  } catch (error: any) {
    logger({
      message: "Failed to create Facebook authorization URL",
      context: error,
    }).error();
    return {
      error: error?.message,
    };
  }
};

export async function updateSessionCookie() {
  const sessionId = (await cookies()).get(lucia.sessionCookieName)?.value ?? null;

  if (sessionId) {
    const { session, user } = await lucia.validateSession(sessionId);
    if (session) {
      try {
        await checkAndRenewQuotas(user.id);
      } catch (e) {
        logger({
          message: "error On checkAndRenewQuotas",
          context: user,
        }).error();
      }

      if (session.fresh) {
        const sessionCookie = lucia.createSessionCookie(session.id);
        (await cookies()).set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }
    } else {
      const sessionCookie = lucia.createBlankSessionCookie();
      (await cookies()).set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
  }
}
