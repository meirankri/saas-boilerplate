import { lucia } from "@/lib/lucia";
import { oauthUpsertUser } from "@/lib/lucia/auth";
import { google } from "@/lib/lucia/oauth";
import { GoogleUser } from "@/types";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/utils/logger";

async function validateSession(
  req: NextRequest
): Promise<{ code: string; state: string } | null> {
  const url = new URL(req.url);
  const searchParams = url.searchParams;

  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code || !state) {
    return null;
  }

  const codeVerifier = cookies().get("codeVerifier")?.value;
  const savedState = cookies().get("state")?.value;

  if (!codeVerifier || !savedState || savedState !== state) {
    return null;
  }

  return { code, state };
}

async function getGoogleUserData(accessToken: string): Promise<GoogleUser> {
  const response = await fetch(
    "https://www.googleapis.com/oauth2/v1/userinfo",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      method: "GET",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch Google user data");
  }

  return response.json();
}

async function createSessionAndSetCookies(userId: string) {
  const session = await lucia.createSession(userId, {
    expiresIn: 60 * 60 * 24 * 30,
  });
  const sessionCookie = lucia.createSessionCookie(session.id);
  const cookieHeader = cookies(); // Get cookie context right before setting it

  cookieHeader.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  cookieHeader.set("state", "", { expires: new Date(0) });
  cookieHeader.set("codeVerifier", "", { expires: new Date(0) });
}

export const GET = async (req: NextRequest) => {
  try {
    const validatedRequest = await validateSession(req);
    if (!validatedRequest) {
      return Response.json({ error: "Invalid request" }, { status: 400 });
    }

    const { code } = validatedRequest;
    const codeVerifier = cookies().get("codeVerifier")?.value;

    const { accessToken, accessTokenExpiresAt, refreshToken } =
      await google.validateAuthorizationCode(code, codeVerifier);

    const googleData = await getGoogleUserData(accessToken);
    let userId: string;
    try {
      userId = await oauthUpsertUser(
        googleData,
        accessToken,
        accessTokenExpiresAt,
        refreshToken
      );
    } catch (error) {
      logger({
        message: "An unexpected error occurred during login",
        context: error,
      });
      return Response.json(
        { message: "An unexpected error occurred during login", error },
        { status: 500 }
      );
    }

    await createSessionAndSetCookies(userId);

    return NextResponse.redirect(
      new URL("/dashboard", process.env.NEXT_PUBLIC_BASE_URL),
      {
        status: 302,
      }
    );
  } catch (error: any) {
    logger({
      message: "Failed to sign in with Google",
      context: error,
    }).error();
    return Response.json(
      { error: error.message },
      {
        status: 500,
      }
    );
  }
};
