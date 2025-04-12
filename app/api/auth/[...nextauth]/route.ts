import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async redirect({ baseUrl }) {
      // Ensure we're using the correct base URL in production
      const productionBaseUrl = "https://cebimfinal.vercel.app";
      const finalBaseUrl = process.env.NODE_ENV === "production" ? productionBaseUrl : baseUrl;
      return `${finalBaseUrl}/dashboard/income`;
    },
  },
});

export { handler as GET, handler as POST }; 