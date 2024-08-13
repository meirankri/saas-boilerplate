import useAuthAndSubscription from "@/app/hooks/useAuthAndSubscription";

interface IsForbidenProps {
  plans: string[];
  children: React.ReactNode;
}

const IsForbiden = ({ plans, children }: IsForbidenProps) => {
  const { subscription } = useAuthAndSubscription();

  if (plans.includes(subscription?.planTitle)) {
    return;
  }
  return children;
};

export default IsForbiden;
