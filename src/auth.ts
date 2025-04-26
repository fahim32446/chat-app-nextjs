import NextAuth, { CredentialsSignin, DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { API_ENDPOINTS } from './utils/api-endpoints';

declare module 'next-auth' {
  interface Session {
    user: {
      id?: string;
      email?: string;
    } & DefaultSession['user'];
  }

  interface User {
    id?: string;
  }

  interface JWT {
    id?: string;
  }
}
class InvalidLoginError extends CredentialsSignin {
  constructor(message: string) {
    super(message);
    this.code = message;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing email or password');
        }

        const response = await fetch(`${process.env.APP_URL}/api/${API_ENDPOINTS.LOGIN}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: credentials.email, password: credentials.password }),
          credentials: 'include',
        });

        const data = await response.json();

        if (!response.ok) {
          throw new InvalidLoginError(data.error || 'Invalid identifier or password');
        }

        return {
          id: data.data.id,
          name: data.data.name,
          email: data?.data?.email,
          image: data?.data?.image,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 3600,
    updateAge: 3600,
  },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Check if this is an update operation
      const isUpdate = trigger === 'update';

      // If it's an update and we have the updateImageUrl in the session, update token
      if (isUpdate && session?.updateImageUrl) {
        token.picture = session.updateImageUrl;
      }

      // Initial sign in - set user properties on token
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;

        // Only set picture from user on initial sign in, not during updates
        if (!isUpdate) {
          token.picture = user.image;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          email: token.email as string,
          name: token.name as string,
        };
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,

  cookies: {
    sessionToken: {
      options: {
        maxAge: 3600,
      },
    },
  },
});
