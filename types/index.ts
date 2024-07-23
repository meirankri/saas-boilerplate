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
