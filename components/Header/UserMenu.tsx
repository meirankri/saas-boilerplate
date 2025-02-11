"use client";
import Image from "next/image";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { useSession } from "@/hooks/useSession";
import { signOut } from "@/actions/auth.actions";
import { ExtendedUser } from "@/types";
import UserQuotaFeatures from "@/components/quota/UserQuotaFeatures";

const UserMenu = () => {
  const t = useTranslations("UserMenu");
  const user = useSession() as ExtendedUser;
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <Menu as="div" className="relative ml-3">
      <div>
        <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
          <span className="absolute -inset-1.5" />

          {user.profilePictureUrl ? (
            <Image
              width={32}
              height={32}
              alt="picture profile"
              src={user.profilePictureUrl}
              className="h-8 w-8 rounded-full"
            />
          ) : (
            <span className="h-8 w-8 rounded-full dark:text-black  bg-white flex justify-center items-center">
              {user?.email?.slice(0, 1)}
            </span>
          )}
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute min-w-56 dark:bg-dark right-0 z-10 mt-2  origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
      >
        <MenuItem>
          <form action={handleSignOut}>
            <button
              type="submit"
              className="block w-full text-center rounded py-2.5 text-sm text-dark hover:text-primary dark:text-white/70 dark:hover:text-white lg:px-3"
            >
              {t("signOut")}
            </button>
          </form>
        </MenuItem>

        {process.env.NEXT_PUBLIC_STRIPE_BILLING_URL && (
          <MenuItem>
            <a
              href={`${process.env.NEXT_PUBLIC_STRIPE_BILLING_URL}?prefilled_email=${user.email}`}
              target="_blank"
              className="block w-full text-center rounded py-2.5 text-sm text-dark hover:text-primary dark:text-white/70 dark:hover:text-white lg:px-3"
            >
              {t("billing")}
            </a>
          </MenuItem>
        )}
        <UserQuotaFeatures />
      </MenuItems>
    </Menu>
  );
};

export default UserMenu;
