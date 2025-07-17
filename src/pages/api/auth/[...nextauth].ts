import NextAuth, { DefaultSession } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord'
import type { JWT } from "next-auth/jwt";
import type { Session, User, Account } from "next-auth";

// Extend the session type to include error
declare module "next-auth" {
  interface Session {
    error?: string;
    accessToken?: string;
  }
}

async function refreshAccessToken(token: JWT) {
  try {
    const url = "https://discord.com/api/oauth2/token";
    
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID!,
        client_secret: process.env.DISCORD_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken as string,
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      expiresAt: Date.now() / 1000 + refreshedTokens.expires_in,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "identify email guilds guilds.join gdm.join",
          prompt: "consent",
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account, user }: { token: JWT; account?: Account | null; user?: User | null }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
      }
      if (user) {
        token.id = user.id;
      }

      // Check if token is expired and refresh it
      if (Date.now() < (token.expiresAt as number) * 1000) {
        return token;
      }

      // Token is expired, try to refresh it
      return await refreshAccessToken(token);
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.user = session.user ?? {};
      (session.user as { id: string }).id = token.id as string;
      session.accessToken = token.accessToken;
      session.error = token.error as string;
      return session;
    },
  },
  events: {
    async signIn(message: { user: User; account: Account | null; profile?: any; isNewUser?: boolean }) {
      const { user, account } = message;
      // Only store Discord users
      if (account?.provider === 'discord') {
        try {
          const clientPromise = (await import('@/lib/mongodb')).default;
          const client = await clientPromise;
          const db = client.db('discord');
          const users = db.collection('users');
          // Upsert user info
          await users.updateOne(
            { id: user.id },
            {
              $set: {
                id: user.id,
                name: user.name,
                email: user.email,
                image: user.image,
                provider: 'discord',
                updatedAt: new Date(),
              },
              $setOnInsert: { createdAt: new Date() },
            },
            { upsert: true }
          );
        } catch (e) {
          // Optionally log error
        }
      }
    },
  },
};

export default NextAuth(authOptions);