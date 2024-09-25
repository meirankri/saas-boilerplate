"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Button from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { SignInSchema } from "../types";
import {
  createFacebookAuthorizationURL,
  createGithubAuthorizationURL,
  createGoogleAuthorizationURL,
} from "../actions/auth.actions";
import { signIn } from "@/actions/magic-link.actions";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import SignUpGoogle from "./Buttons/SIgnUpGoogle";
import SignUpGithub from "./Buttons/SignUpGithub";
import SignUpFacebook from "./Buttons/SignUpFacebook";
import env from '@/lib/env';


export function SignForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof SignInSchema>) {
    const res = await signIn(values);

    if (!res.success) {
      toast({
        variant: "destructive",
        description: res.message,
      });
    } else if (res.success) {
      toast({
        variant: "default",
        description: res.message,
      });

      router.push("/dashboard");
    }
  }

  const onGoogleSignInClicked = async () => {
    console.debug("Google sign in clicked");
    const res = await createGoogleAuthorizationURL();
    if (res.error) {
      toast({
        variant: "destructive",
        description: res.error,
      });
    } else if (res.success) {
      window.location.href = res.data;
    }
  };

  const onFacebookSignInClicked = async () => {
    console.debug("Facebook sign in clicked");
    const res = await createFacebookAuthorizationURL();
    if (res.error) {
      toast({
        variant: "destructive",
        description: res.error,
      });
    } else if (res.success) {
      window.location.href = res.data;
    }
  };

  const onGithubSignInClicked = async () => {
    console.debug("github sign in clicked");
    const res = await createGithubAuthorizationURL();
    if (res.error) {
      toast({
        variant: "destructive",
        description: res.error,
      });
    } else if (res.success) {
      window.location.href = res.data;
    }
  };

  return (
    <>
      {env.NEXT_PUBLIC_GOOGLE_AUTH === "true" && (
        <div className="w-full flex item-center justify-center">
          <SignUpGoogle onClick={onGoogleSignInClicked} />
        </div>
      )}

      {env.NEXT_PUBLIC_GITHUB_AUTH === "true" && (
        <div className="w-full flex item-center justify-center">
          <SignUpGithub onClick={onGithubSignInClicked} />
        </div>
      )}

      {env.NEXT_PUBLIC_FACEBOOK_AUTH === "true" && (
        <div className="w-full flex item-center justify-center">
          <SignUpFacebook onClick={onFacebookSignInClicked} />
        </div>
      )}

      <div className="mb-8 flex items-center justify-center">
        <span className="hidden h-[1px] w-full max-w-[70px] bg-body-color/50 sm:block"></span>
        <p className="w-full px-5 text-center text-base font-medium text-body-color">
          Or, sign in with your email
        </p>
        <span className="hidden h-[1px] w-full max-w-[70px] bg-body-color/50 sm:block"></span>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mb-6 mt-6">
            <Button type="submit">Sign in</Button>
          </div>
        </form>
      </Form>
    </>
  );
}
