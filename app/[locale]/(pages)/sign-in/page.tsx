import { SignForm } from "@/components/SignForm";
import { validateRequest } from "@/lib/lucia";
import { redirect } from "next/navigation";

export default async function SignUpPage() {
  const { user } = await validateRequest();

  if (user) {
    return redirect("/");
  }

  return (
    <div className="pt:mt-0 mx-auto flex flex-col items-center justify-center px-6 pt-8 dark:bg-gray-900 md:h-screen">
      <div className="w-full max-w-xl space-y-8 rounded-lg bg-white p-6 shadow dark:bg-gray-800 sm:p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Sign to your account
        </h2>
        <SignForm />
      </div>
    </div>
  );
}
