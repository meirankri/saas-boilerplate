import env from "@/lib/env";
import { logger } from "@/utils/logger";

export const verifyRecaptcha = async (): Promise<boolean> => {
  if (!env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_KEY) {
    logger({
      message: "Missing NEXT_PUBLIC_GOOGLE_RECAPTCHA_KEY environment variable",
    }).warn();
    return true;
  }

  try {
    const token = await new Promise<string>((resolve) => {
      if (typeof window !== "undefined" && window.grecaptcha) {
        window.grecaptcha.ready(() => {
          window.grecaptcha
            .execute(env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_KEY, {
              action: "submit",
            })
            .then(resolve);
        });
      }
    });

    const recaptchaResponse = await fetch("/api/verify-recaptcha", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    const recaptchaData = await recaptchaResponse.json();
    return recaptchaData.success;
  } catch (error) {
    logger({
      message: "Server error during reCAPTCHA verification",
      context: error,
    }).error();
    return false;
  }
}; 