import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "@/lib/database/db";
import { lucia } from "@/lib/lucia";
import { cookies } from "next/headers";
import { logger } from "@/utils/logger";

export const GET = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);

    const searchParams = url.searchParams;

    const token = searchParams.get("token");

    if (!token) {
      return Response.json(
        {
          error: "Token is not existed",
        },
        {
          status: 400,
        }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      email: string;
      userId: string;
    };
    const existedToken = await db.magicLink.findFirst({
      where: {
        userId: decoded.userId,
      },
    });

    if (!existedToken) {
      return Response.json(
        {
          error: "Invalid token",
        },
        {
          status: 400,
        }
      );
    } else {
      await db.magicLink.delete({
        where: {
          userId_token: {
            userId: decoded.userId,
            token,
          },
        },
      });
    }

    const session = await lucia.createSession(decoded.userId, {
      expiresIn: 60 * 60 * 24 * 30,
    });

    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return Response.redirect(new URL(process.env.NEXT_PUBLIC_BASE_URL!), 302);
  } catch (e: any) {
    logger({
      message: "Failed to sign in with magic link",
      context: e,
    }).error();
    return Response.json(
      {
        error: e.message,
      },
      {
        status: 400,
      }
    );
  }
};
