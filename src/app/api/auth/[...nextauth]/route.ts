// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          response_type: "code",
          scope: "https://www.googleapis.com/auth/gmail.readonly",
        },
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, account }) => {
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      console.log(token, account, " Token");

      return token;
    },
    async session({ session, token }) {
      session.accessToken = await token.accessToken;
      console.log(session.accessToken, " Token stored in session");
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
