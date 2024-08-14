"use client";
import Image from "next/image";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

import { useSession } from "@/providers/SessionProvider";
import { signOut } from "@/actions/auth.actions";
import { ExtendedUser } from "@/types";

const UserMenu = () => {
  const user = useSession() as ExtendedUser;

  return (
    <Menu as="div" className="relative ml-3">
      <div>
        <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
          <span className="absolute -inset-1.5" />

          {user.profilePictureUrl ? (
            <Image
              width={32}
              height={32}
              alt=""
              src={user.profilePictureUrl}
              className="h-8 w-8 rounded-full"
            />
          ) : (
            <span className="h-8 w-8 rounded-full bg-white flex justify-center items-center">
              {user.email.slice(0, 1)}
            </span>
          )}
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute dark:bg-dark right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
      >
        {/* <div className="submenu relative left-0 top-full rounded-sm bg-white transition-[top] duration-300 group-hover:opacity-100 dark:bg-dark lg:invisible lg:absolute lg:top-[110%] lg:block lg:w-[250px] lg:p-4 lg:opacity-0 lg:shadow-lg lg:group-hover:visible lg:group-hover:top-full">
          <form action={signOut}>
            <button
              type="submit"
              className="block rounded py-2.5 text-sm text-dark hover:text-primary dark:text-white/70 dark:hover:text-white lg:px-3"
            >
              Sign out
            </button>
          </form>
          {process.env.NEXT_PUBLIC_STRIPE_BILLING_URL && (
            <a
              href={`${process.env.NEXT_PUBLIC_STRIPE_BILLING_URL}?prefilled_email=${user.email}`}
              target="_blank"
              className="block rounded py-2.5 text-sm text-dark hover:text-primary dark:text-white/70 dark:hover:text-white lg:px-3"
            >
              Billing
            </a>
          )}
        </div> */}
        <MenuItem>
          <form action={signOut}>
            <button
              type="submit"
              className="block w-full text-center rounded py-2.5 text-sm text-dark hover:text-primary dark:text-white/70 dark:hover:text-white lg:px-3"
            >
              Sign out
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
              Billing
            </a>
          </MenuItem>
        )}
      </MenuItems>
    </Menu>
  );
};

export default UserMenu;
