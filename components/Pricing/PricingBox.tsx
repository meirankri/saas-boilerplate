import useAuthAndSubscription from "@/app/hooks/useAuthAndSubscription";
import { Link } from "@/i18n.config";
import Image from "next/image";
interface PricingBoxProps {
  packageName: string;
  price: number;
  duration: string;
  subtitle: string;
  children: React.ReactNode;
  currency: string;
  buttonText: string;
  link: string;
}

const PricingBox = ({
  packageName,
  price,
  duration,
  subtitle,
  children,
  currency,
  buttonText,
  link,
}: PricingBoxProps) => {
  const { user } = useAuthAndSubscription();
  return (
    <div className="wow fadeInUp relative z-10 rounded-md bg-white px-8 py-10 shadow-signUp dark:bg-[#1D2144]">
      <div className="flex items-center justify-between">
        <h3 className="price mb-2 text-3xl font-bold text-black dark:text-white">
          {currency}
          {price}
          <span className="time text-body-color text-base font-medium">
            /{duration}
          </span>
        </h3>
        <h4 className="mb-2 text-xl font-bold text-dark dark:text-white">
          {packageName}
        </h4>
      </div>
      <p className="mb-7 text-base text-body-color">{subtitle}</p>
      <div className="mb-8 border-b border-body-color border-opacity-10 pb-8 dark:border-white dark:border-opacity-10">
        <Link
          href={`${link}${user?.email ? `?prefilled_email=${user.email}` : ""}`}
          target="_blank"
          className="flex w-full items-center justify-center rounded-md bg-primary p-3 text-base font-semibold text-white transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp"
        >
          {buttonText}
          <Image
            src="/images/target-blank.svg"
            alt="target-blank"
            width={15}
            height={15}
            className="ml-2"
          />
        </Link>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default PricingBox;
