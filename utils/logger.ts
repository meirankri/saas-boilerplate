export const logger = ({
  message,
  context,
}: {
  message: string;
  context?: unknown;
}) => {
  return {
    info: () => console.log(message, context),
    error: () => {
      console.error(message, context);
    },
    warn: () => console.warn(message, context),
  };
};
