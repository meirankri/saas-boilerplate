import { User } from "lucia";
import { z } from "zod";
export const SignUpSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export const SignInSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export type Navigation = {
  name: string;
  href: string;
  current: boolean;
};

export interface ExtendedUser extends User {
  email: string;
  profilePictureUrl: string;
  name: string;
  id: string;
}

export interface GoogleUser {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  picture: string;
  locale: string;
}

export interface QuotaInfo {
  remaining: number;
  total: number;
  productName: string;
}
export interface UseQuotaResult {
  userId: string | null;
  productName: string | null;
  quotaInfo: QuotaInfo | null;
  isLoading: boolean;
  error: string | null;
  canUseProduct: boolean;
  remaining: number;
  fetchQuotaInfo: () => Promise<void>;
  decrementQuota: (amount?: number) => Promise<void>;
}

export type PricingPlan = {
  planTitle: string;
  price: number;
  timeline: string;
  currency: string;
  link: string;
  priceId: string;
  description: string;
  stripeTimeline: "MONTHLY" | "YEARLY";
  products: {
    name: string;
    quota: number;
  }[];
  features: {
    label: string;
    isActive: boolean;
  }[];
};

export interface ExtendedPricingPlan extends PricingPlan {
  monthlyEquivalent?: number;
  discount?: number;
}
