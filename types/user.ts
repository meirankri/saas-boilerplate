import { Product, Subscription, User } from "@prisma/client";

export type UserWithSubscription = User & {
  subscription?: Subscription;
  products?: Product[];
};

export type SubscriptionWithProducts = Subscription & {
  products?: Product[];
};
