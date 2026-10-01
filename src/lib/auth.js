import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { sendEmail } from "./email";

const uri = process.env.BETTER_AUTH_DB_URL;
if (!uri) {
  throw new Error("Missing BETTER_AUTH_DB_URL in environment variables");
}

const client = new MongoClient(uri);
await client.connect();
const db = client.db("better-auth-db");

export const auth = betterAuth({
  baseURL: "http://localhost:3000",
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    // 👉 রিসেট পাসওয়ার্ড ইমেইল হ্যান্ডলার
    sendResetPassword: async ({ user, url, token }, request) => {
      const resetLink = `${url}?callbackURL=http://localhost:3000/sign-in`;

      await sendEmail({
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${resetLink}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Reset your password</h2>
            <p>Click below to choose a new password:</p>
            <a href="${resetLink}">Reset Password</a>
          </div>
        `,
      });
    },
  },
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailConfirmation: async ({ user, newEmail, url, token }, request) => {
        const changeEmailLink = `${url}?callbackURL=http://localhost:3000/profile`;
        await sendEmail({
          to: newEmail,
          subject: "Approve Email Change",
          text: `Click the link to approve: ${changeEmailLink}`,
        });
      },
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      const verificationLink = `${url}?callbackURL=http://localhost:3000/profile`;
      await sendEmail({
        to: user.email,
        subject: "Verify your email address",
        text: `Please verify your email: ${verificationLink}`,
      });
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.BETTER_AUTH_GOOGLE_CLIENT_ID,
      clientSecret: process.env.BETTER_AUTH_GOOGLE_SECRET,
    },
    github: {
      clientId: process.env.BETTER_AUTH_GITHUB_CLIENT_ID,
      clientSecret: process.env.BETTER_AUTH_GITHUB_SECRET,
    },
  },
  trustedOrigins: ["http://localhost:3000"],
});