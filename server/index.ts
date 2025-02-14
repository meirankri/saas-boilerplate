import { router } from "./trpc";
import { contactRouter } from "./routes/contact";

export const appRouter = router({
  contact: contactRouter,
});

export type AppRouter = typeof appRouter;
