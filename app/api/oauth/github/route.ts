import { db } from "@/lib/database/db";
import { lucia } from "@/lib/lucia";
import { github } from "@/lib/lucia/oauth";
import { generateId } from "lucia";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/utils/logger";

export const GET = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!code || !state) {
      return Response.json(
        { error: "Invalid request" },
        {
          status: 400,
        }
      );
    }

    const savedState = (await cookies()).get("state")?.value;

    if (!savedState) {
      return Response.json(
        { error: "saved state is not exists" },
        {
          status: 400,
        }
      );
    }

    if (savedState !== state) {
      return Response.json(
        {
          error: "State does not match",
        },
        {
          status: 400,
        }
      );
    }

    const { accessToken } = await github.validateAuthorizationCode(code);

    const githubRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      method: "GET",
    });

    const githubData = (await githubRes.json()) as any;

    await handleGitHubAuth(githubData, accessToken);

    const session = await lucia.createSession(githubData.id, {
      expiresIn: 60 * 60 * 24 * 30,
    });
    const sessionCookie = lucia.createSessionCookie(session.id);

    (await cookies()).set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    (await cookies()).set("state", "", {
      expires: new Date(0),
    });

    return NextResponse.redirect(
      new URL("/dashboard", process.env.NEXT_PUBLIC_BASE_URL),
      {
        status: 302,
      }
    );
  } catch (error: any) {
    logger({
      message: "Failed to sign in with GitHub",
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

type GitHubData = {
  id: string;
  email: string;
  name: string;
  avatar_url: string;
};

async function handleGitHubAuth(githubData: GitHubData, accessToken: string) {
  try {
    await db.$transaction(async (trx) => {
      const user = await trx.user.findFirst({
        where: { id: githubData.id },
      });

      if (!user) {
        const createdUser = await trx.user.create({
          data: {
            email: githubData.email,
            id: githubData.id,
            name: githubData.name,
            profilePictureUrl: githubData.avatar_url,
          },
          select: { id: true },
        });

        if (!createdUser) {
          throw new Error("Failed to create user");
        }

        const expiresAt = new Date(Date.now() + 3600 * 1000); // 1 hour from now

        const createdOAuthAccount = await trx.oauthAccount.create({
          data: {
            accessToken,
            id: generateId(15), // Assuming you have this function
            provider: "github",
            providerUserId: githubData.id,
            userId: githubData.id,
            expiresAt,
          },
        });

        if (!createdOAuthAccount) {
          throw new Error("Failed to create OAuthAccount");
        }
      } else {
        const updatedOAuthAccount = await trx.oauthAccount.update({
          where: { id: githubData.id },
          data: { accessToken },
        });

        if (!updatedOAuthAccount) {
          throw new Error("Failed to update OAuthAccount");
        }
      }

      return true;
    });
  } catch (error) {
    logger({
      message: "Failed to handle GitHub auth",
      context: error,
    }).error();
    return Response.json(
      { error: error.message },
      {
        status: 500,
      }
    );
  }
}
