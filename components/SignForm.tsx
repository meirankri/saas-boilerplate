"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
      <div className="w-full flex item-center justify-center">
        <Button
          onClick={onGithubSignInClicked}
          variant={"outline"}
          className="w-full"
        >
          Sign in with Github
        </Button>
      </div>

      <div className="w-full flex item-center justify-center">
        <Button
          onClick={onGoogleSignInClicked}
          variant={"outline"}
          className="w-full"
        >
          Sign in with Google
        </Button>
      </div>

      <div className="w-full flex item-center justify-center">
        <Button
          onClick={onFacebookSignInClicked}
          variant={"outline"}
          className="w-full"
        >
          Sign in with Facebook
        </Button>
      </div>

      <div className="w-full flex items-center justify-center gap-2">
        <span className="border-b border-gray-300 w-full"></span>
        <span className="flex-none">Or sign in with your email</span>
        <span className="border-b border-gray-300 w-full"></span>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />{" "}
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </>
  );
}
