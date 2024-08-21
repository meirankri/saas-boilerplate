import { Metadata } from "next";
import { redirect } from "next/navigation";

import { validateSession } from "@/lib/lucia";
import { SignForm } from "@/components/SignForm";

export const metadata: Metadata = {
  title: "Sign In Page | Free Next.js Template for Startup and SaaS",
  description: "This is Sign In Page for Startup Nextjs Template",
};

const SigninPage = async () => {
  const { user } = await validateSession();

  if (user) {
    return redirect("/");
  }

  return (
    <>
      <section className="relative z-10 overflow-hidden pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[180px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div className="shadow-three mx-auto max-w-[500px] rounded bg-white px-6 py-10 dark:bg-dark sm:p-[60px]">
                <h3 className="mb-3 text-center text-2xl font-bold text-black dark:text-white sm:text-3xl">
                  Sign in to your account
                </h3>
                <p className="mb-11 text-center text-base font-medium text-body-color">
                  Login to your account for a faster checkout.
                </p>

                <SignForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SigninPage;
