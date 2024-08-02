/*
  Warnings:

  - A unique constraint covering the columns `[subscriptionPlan]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Subscription_subscriptionPlan_key" ON "Subscription"("subscriptionPlan");
