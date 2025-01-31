import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { db } from "@/lib/database/db";
import { generateId } from "lucia";
import { pricingPlanByPriceId } from "@/app/constants/stripe";
import { isEmpty } from "@/utils/checker";
import { PricingPlan } from "@/types";
import { SubscriptionWithProducts } from "@/types/user";
import { addMonths } from "@/utils/date";
import { logger } from "@/utils/logger";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = (await headers()).get("stripe-signature");

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
      case "customer.subscription.updated":
      case "customer.subscription.created":
        await handleCheckoutSessionCompleted(event.data.object);
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
    logger({
      message: "Failed to handle stripe webhook",
      context: err,
    });
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Subscription) {
  const customerId = session.customer as string;
  const customer = await stripe.customers.retrieve(customerId);
  const priceId = session.items?.data[0]?.price?.id;
  if (customer.deleted) {
    console.error("Customer has been deleted");
    return;
  }

  if (!priceId) {
    console.error("No price ID found in session");
    return;
  }

  const plan = pricingPlanByPriceId(priceId);

  if (customer.deleted !== true) {
    if (typeof customer === "object" && customer.email) {
      await updateOrCreateUser(customer.email, customerId, priceId, plan);
    } else {
      console.error("Invalid customer data");
    }
  }
}

async function updateOrCreateUser(
  email: string,
  customerId: string,
  priceId: string,
  plan: PricingPlan
) {
  const existingUser = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (isEmpty(existingUser)) {
    const userId = generateId(15);
    await createNewUser(userId, email, customerId, priceId, plan);
  } else {
    await updateExistingUser(existingUser.id, customerId, priceId, plan);
  }
}

async function createNewUser(
  userId: string,
  email: string,
  customerId: string,
  priceId: string,
  plan: PricingPlan
): Promise<void> {
  await db.$transaction(async (trx) => {
    const subscription: SubscriptionWithProducts =
      await trx.subscription.findFirst({
        where: {
          planTitle: plan.planTitle,
          timeline: plan.stripeTimeline,
        },
        include: { products: true },
      });
    const now = new Date();

    await trx.user.create({
      data: {
        id: userId,
        email,
        stripeCustomerId: customerId,
        priceId,
        subscriptionDate: now,
        nextQuotaRenewalDate: addMonths(now, 1),
        subscription: {
          connect: { id: subscription.id },
        },
        ProductUsage: {
          create: subscription.products.map((product) => ({
            product: { connect: { id: product.id } },
            remaining: product.quota,
          })),
        },
      },
    });
  });
}

async function updateExistingUser(
  userId: string,
  customerId: string,
  priceId: string,
  plan: PricingPlan
): Promise<void> {
  await db.$transaction(async (trx) => {
    const subscription: SubscriptionWithProducts =
      await trx.subscription.findFirst({
        where: {
          planTitle: plan.planTitle,
          timeline: plan.stripeTimeline,
        },
        include: { products: true },
      });

    await trx.productUsage.deleteMany({
      where: { userId },
    });
    const now = new Date();

    await trx.user.update({
      where: { id: userId },
      data: {
        subscription: { connect: { id: subscription.id } },
        stripeCustomerId: customerId,
        subscriptionDate: now,
        nextQuotaRenewalDate: addMonths(now, 1),
        priceId,
        ProductUsage: {
          create: subscription.products.map((product) => ({
            id: generateId(15),
            product: { connect: { id: product.id } },
            remaining: product.quota,
          })),
        },
      },
    });
  });
}

async function handleCustomerSubscriptionDeleted(
  subscription: Stripe.Subscription
) {
  const existingUser = await db.user.findUnique({
    where: {
      stripeCustomerId: subscription.customer as string,
    },
    include: { subscription: true },
  });

  if (existingUser && existingUser.subscriptionId) {
    await db.user.update({
      where: { id: existingUser.id },
      data: {
        subscription: { disconnect: true },
        ProductUsage: { deleteMany: {} },
      },
    });
  }
}
