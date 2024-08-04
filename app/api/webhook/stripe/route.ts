import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { db } from "@/lib/database/db";
import { generateId } from "lucia";
import { pricingPlanByPriceId } from "@/app/constants/stripe";
import { isEmpty } from "@/lib/utils";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = headers().get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "No signature provided" },
        { status: 400 }
      );
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );

    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session
        );
        break;
      case "customer.subscription.deleted":
        await handleCustomerSubscriptionDeleted(
          event.data.object as Stripe.Subscription
        );
        break;
      default:
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error(`Webhook error: ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  const customerId = session.customer as string;
  const customer = await stripe.customers.retrieve(customerId);

  if (customer.deleted) {
    console.error("Customer has been deleted");
    return;
  }

  const expandedSession = await stripe.checkout.sessions.retrieve(session.id, {
    expand: ["line_items"],
  });

  const priceId = expandedSession.line_items?.data[0]?.price?.id;
  if (!priceId) {
    console.error("No price ID found in session");
    return;
  }

  const planTitle = pricingPlanByPriceId(priceId);
  if (customer.deleted !== true) {
    if (typeof customer === "object" && customer.email) {
      await updateOrCreateUser(customer.email, customerId, priceId, planTitle);
    } else {
      console.error("Invalid customer data");
    }
  }
}

async function updateOrCreateUser(
  email: string,
  customerId: string,
  priceId: string,
  planTitle: string
) {
  const existingUser = await db.users.findUnique({
    where: {
      email,
    },
  });

  if (isEmpty(existingUser)) {
    const userId = generateId(15);
    await createNewUser(userId, email, customerId, priceId, planTitle);
  } else {
    await updateExistingUser(existingUser.id, customerId, priceId, planTitle);
  }
}

async function createNewUser(
  userId: string,
  email: string,
  customerId: string,
  priceId: string,
  planTitle: string
) {
  await db.users.create({
    data: {
      id: userId,
      email,
      stripeCustomerId: customerId,
      priceId,
    },
  });

  await db.subscriptions.create({
    data: {
      userId,
      subscriptionPlan: planTitle,
    },
  });
}

async function updateExistingUser(
  userId: string,
  customerId: string,
  priceId: string,
  planTitle: string
) {
  await db.users.update({
    where: {
      id: userId,
    },
    data: {
      stripeCustomerId: customerId,
      priceId,
    },
  });

  await db.subscriptions.upsert({
    where: {
      userId,
    },
    create: {
      userId,
      subscriptionPlan: planTitle,
    },
    update: {
      subscriptionPlan: planTitle,
    },
  });
}

async function handleCustomerSubscriptionDeleted(
  subscription: Stripe.Subscription
) {
  const existingUser = await db.users.findUnique({
    where: {
      stripeCustomerId: subscription.customer as string,
    },
  });

  await db.subscriptions.delete({
    where: {
      userId: existingUser.id,
    },
  });
}