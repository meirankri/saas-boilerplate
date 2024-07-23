import { getCurrentUser } from ".";
import db from "@/lib/database";
import { subscriptionTable } from "@/lib/database/schema";
import { eq } from "drizzle-orm";

export async function getAuthStatus() {
  const user = await getCurrentUser();
  if (!user) {
    return { user: null, subscription: null };
  }

  const [subscriptionData] = await db
    .select()
    .from(subscriptionTable)
    .where(eq(subscriptionTable.userId, user.id));

  return {
    user: user,
    subscription: subscriptionData,
  };
}
