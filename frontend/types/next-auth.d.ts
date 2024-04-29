import NextAuth from "next-auth/next";

declare module "next-auth" {
  interface User {
    username: string;
    email: string;
    role: string;
    joinedAt: string;
    phone: string[];
  }
  interface Session {
    user: User;
  }
}
