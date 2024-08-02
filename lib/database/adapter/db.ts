import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const db = {
  // Utilisateurs
  users: {
    findMany: (args?: Parameters<typeof prisma.user.findMany>[0]) =>
      prisma.user.findMany(args),
    findUnique: (args: Parameters<typeof prisma.user.findUnique>[0]) =>
      prisma.user.findUnique(args),
    create: (args: Parameters<typeof prisma.user.create>[0]) =>
      prisma.user.create(args),
    update: (args: Parameters<typeof prisma.user.update>[0]) =>
      prisma.user.update(args),
    delete: (args: Parameters<typeof prisma.user.delete>[0]) =>
      prisma.user.delete(args),
    upsert: (args: Parameters<typeof prisma.user.upsert>[0]) =>
      prisma.user.upsert(args),
  },

  // Abonnements
  subscriptions: {
    findMany: (args?: Parameters<typeof prisma.subscription.findMany>[0]) =>
      prisma.subscription.findMany(args),
    findUnique: (args: Parameters<typeof prisma.subscription.findUnique>[0]) =>
      prisma.subscription.findUnique(args),
    create: (args: Parameters<typeof prisma.subscription.create>[0]) =>
      prisma.subscription.create(args),
    update: (args: Parameters<typeof prisma.subscription.update>[0]) =>
      prisma.subscription.update(args),
    delete: (args: Parameters<typeof prisma.subscription.delete>[0]) =>
      prisma.subscription.delete(args),
    upsert: (args: Parameters<typeof prisma.subscription.upsert>[0]) =>
      prisma.subscription.upsert(args),
  },

  magicLink: {
    select: (args?: Parameters<typeof prisma.magicLink.findMany>[0]) =>
      prisma.magicLink.findMany(args),
    findUnique: (args: Parameters<typeof prisma.magicLink.findUnique>[0]) =>
      prisma.magicLink.findUnique(args),
    create: (args: Parameters<typeof prisma.magicLink.create>[0]) =>
      prisma.magicLink.create(args),
    update: (args: Parameters<typeof prisma.magicLink.update>[0]) =>
      prisma.magicLink.update(args),
    delete: (args: Parameters<typeof prisma.magicLink.delete>[0]) =>
      prisma.magicLink.delete(args),
    upsert: (args: Parameters<typeof prisma.magicLink.upsert>[0]) =>
      prisma.magicLink.upsert(args),
  },

  oauthAccount: {
    findMany: (args?: Parameters<typeof prisma.oauthAccount.findMany>[0]) =>
      prisma.oauthAccount.findMany(args),
    findUnique: (args: Parameters<typeof prisma.oauthAccount.findUnique>[0]) =>
      prisma.oauthAccount.findUnique(args),
    create: (args: Parameters<typeof prisma.oauthAccount.create>[0]) =>
      prisma.oauthAccount.create(args),
    update: (args: Parameters<typeof prisma.oauthAccount.update>[0]) =>
      prisma.oauthAccount.update(args),
    delete: (args: Parameters<typeof prisma.oauthAccount.delete>[0]) =>
      prisma.oauthAccount.delete(args),
    upsert: (args: Parameters<typeof prisma.oauthAccount.upsert>[0]) =>
      prisma.oauthAccount.upsert(args),
  },

  session: {
    findMany: (args?: Parameters<typeof prisma.session.findMany>[0]) =>
      prisma.session.findMany(args),
    findUnique: (args: Parameters<typeof prisma.session.findUnique>[0]) =>
      prisma.session.findUnique(args),
    create: (args: Parameters<typeof prisma.session.create>[0]) =>
      prisma.session.create(args),
    update: (args: Parameters<typeof prisma.session.update>[0]) =>
      prisma.session.update(args),
    delete: (args: Parameters<typeof prisma.session.delete>[0]) =>
      prisma.session.delete(args),
    upsert: (args: Parameters<typeof prisma.session.upsert>[0]) =>
      prisma.session.upsert(args),
  },

  transaction: <T>(
    fn: (trx: Omit<typeof prisma, "$transaction">) => Promise<T>
  ) => {
    return prisma.$transaction(fn);
  },
  // Ajoutez d'autres modèles de la même manière...

  // Fonction pour fermer la connexion à la base de données
  disconnect: () => prisma.$disconnect(),
};
