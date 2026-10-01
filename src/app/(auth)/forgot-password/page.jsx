"use client";

import { ArrowRight } from "@gravity-ui/icons";
import { Button, Card, FieldError, Form, Label, TextField } from "@heroui/react";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email")?.toString().trim();

    if (!email) {
      alert("দয়া করে ইমেইল অ্যাড্রেসটি লিখুন!");
      setLoading(false);
      return;
    }

    try {
      // BetterAuth-এর পাসওয়ার্ড রিসেট এন্ডপয়েন্টে সরাসরি সেফ কল
      const res = await fetch("/api/auth/request-password-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          redirectTo: "/reset-password",
        }),
      });

      // যদি request-password-reset না পেয়ে ৪০৪ দেয়, তবে অল্টারনেটিভ রুট চেক করবে
      if (res.status === 404) {
        const fallbackRes = await fetch("/api/auth/forget-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            redirectTo: "/reset-password",
          }),
        });

        if (!fallbackRes.ok) {
          const errData = await fallbackRes.json().catch(() => ({}));
          throw new Error(errData.message || "রিসেট লিংক পাঠানো ব্যর্থ হয়েছে!");
        }
      } else if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "রিসেট লিংক পাঠানো ব্যর্থ হয়েছে!");
      }

      setIsSent(true);
    } catch (err) {
      console.error("Forgot Password Error:", err);
      alert(err.message || "সার্ভারে সমস্যা হয়েছে, আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center p-4">
      <Card className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/90 p-8 shadow-xl">
        
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400">
            <span className="text-xl">🔑</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Forgot Password?</h2>
          <p className="mt-1 text-sm text-slate-400">
            আপনার অ্যাকাউন্টের ইমেইল দিন, পাসওয়ার্ড রিসেট লিংক পাঠানো হবে।
          </p>
        </div>

        {isSent ? (
          <div className="text-center space-y-4">
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-emerald-400 text-sm">
              পাসওয়ার্ড রিসেটের লিংক পাঠানো হয়েছে! টার্মিনাল কনসোল অথবা ইমেইল চেক করুন।
            </div>
            <Link
              href="/sign-in"
              className="inline-block text-sm font-semibold text-indigo-400 hover:text-indigo-300"
            >
              Back to Sign In
            </Link>
          </div>
        ) : (
          <Form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <TextField isRequired name="email" type="email">
              <Label className="text-sm font-medium text-slate-300">Email Address</Label>
              <input
                name="email"
                type="email"
                required
                placeholder="name@example.com"
                className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-800/90 px-4 py-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-all"
              />
              <FieldError className="mt-1 text-xs text-rose-400" />
            </TextField>

            <Button
              type="submit"
              disabled={loading}
              className="mt-2 w-full cursor-pointer rounded-xl bg-indigo-600 py-3 font-semibold text-white shadow-md transition-all hover:bg-indigo-500 flex items-center justify-center gap-2"
            >
              {loading ? "Sending link..." : "Send Reset Link"}
              {!loading && <ArrowRight className="size-4" />}
            </Button>

            <div className="text-center mt-2">
              <Link href="/sign-in" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300">
                Cancel and return to Sign In
              </Link>
            </div>
          </Form>
        )}

      </Card>
    </div>
  );
}