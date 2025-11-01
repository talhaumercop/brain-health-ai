import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./lib/db";
import { getUserById } from "./modules/auth/actions";
import authConfig from "./auth.config";

// Create a custom adapter that extends PrismaAdapter
const customPrismaAdapter = {
  ...PrismaAdapter(db),
  // Override the createUser function to ensure we use our own ID format
  async createUser(data) {
    // Use Prisma directly to create the user with CUID
    return db.user.create({
      data
    });
  }
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: customPrismaAdapter,
  session: { strategy: "jwt" },

  callbacks: {
    async signIn({ user, account }) {
      if (!user || !account) return false;

      const existingUser = await db.user.findUnique({
        where: { email: user.email! },
      });

      if (!existingUser) {
        const newUser = await db.user.create({
          data: {
            email: user.email!,
            name: user.name,
            image: user.image,
            accounts: {
              // @ts-ignore
              create: {
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                refreshToken: account.refresh_token,
                accessToken: account.access_token,
                expiresAt: account.expires_at,
                tokenType: account.token_type,
                scope: account.scope,
                idToken: account.id_token,
                sessionState: account.session_state,
              },
            },
          },
        });
        if (!newUser) return false;
      } else {
        // Link social account if not exists
        const existingAccount = await db.account.findUnique({
          where: {
            provider_providerAccountId: {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            },
          },
        });

        if (!existingAccount) {
          await db.account.create({
            data: {
              userId: existingUser.id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              refreshToken: account.refresh_token,
              accessToken: account.access_token,
              expiresAt: account.expires_at,
              tokenType: account.token_type,
              scope: account.scope,
              idToken: account.id_token,
              //   @ts-ignore
              sessionState: account.session_state,
            },
          });
        }
      }
      return true;
    },

    // jwt gets called when issuing/updating the token
    async jwt({ token, user }) {
      // Always fetch the user from the database to ensure we have the CUID
      if (token.email) {
        const dbUser = await db.user.findUnique({
          where: { email: token.email as string }
        });
        
        if (dbUser) {
          // Use the database CUID as the subject
          token.sub = dbUser.id;
        }
      }

      // Optionally persist name/email on the token for easy access
      if (user) {
        token.name = (user as any).name ?? token.name;
        token.email = (user as any).email ?? token.email;
      }
      
      console.log('JWT callback - token.sub:', token.sub, 'user?.id:', user?.id);
      return token;
    },

    // session is called when returning the session object to the client
    async session({ session, token }) {
      if (session.user && token.sub) {
        // token.sub should now be the Prisma user id (CUID)
        session.user.id = token.sub as string;
      }
      console.log('SESSION callback - token.sub:', token.sub);
      return session;
    },
  }
});
