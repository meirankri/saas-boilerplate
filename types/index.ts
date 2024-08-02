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
