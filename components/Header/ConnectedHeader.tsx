"use client";
import Image from "next/image";
import { Link } from "@/i18n.config";
import { useSession } from "@/hooks/useSession";
import UserMenu from "./UserMenu";

const ConnectedHeader = () => {
  const user = useSession();

  return (
    <header className="fixed top-0 left-0 w-full shadow-md z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo/logo.svg"
              alt="logo"
              width={140}
              height={30}
              className="w-auto h-8"
            />
          </Link>
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default ConnectedHeader;
