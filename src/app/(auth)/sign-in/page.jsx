"use client";

import { authClient, signIn } from "@/lib/auth-client";
import { Eye, EyeSlash, ArrowRight } from "@gravity-ui/icons";
import {
  Button,
  Card,
  FieldError,
  Form,
  Label,
  TextField,
} from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SignInPage = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const { data: resData, error } = await signIn.email({
        email: data.email,
        password: data.password,
        rememberMe: true,
        callbackURL: "/profile",
      });

      if (error) {
        // যদি এখনও সার্ভার কোনো কারণে ভেরিফিকেশন চায়
        if (error.message?.toLowerCase().includes("not verified")) {
          alert("আপনার অ্যাকাউন্টটি এখনো ভেরিফাই করা হয়নি। দয়া করে ইমেইল ইনবক্স চেক করে ভেরিফাই করুন।");
        } else {
          alert(error.message || "ইমেইল বা পাসওয়ার্ড ভুল হয়েছে!");
        }
      } else {
        router.push("/profile");
        router.refresh();
      }
    } catch (err) {
      console.error("Sign-in error:", err);
      alert("সার্ভারে সমস্যা হয়েছে, আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/profile",
    });
  };

  const handleGithubSignIn = async () => {
    await authClient.signIn.social({
      provider: "github",
      callbackURL: "/profile",
    });
  };

return (
    <div className="flex min-h-[85vh] items-center justify-center p-4">
      <Card className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        
        {/* লোগো ও হেডার */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <span className="text-xl">🔐</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Welcome Back</h2>
          <p className="mt-1 text-sm text-slate-500">Sign in to access your dashboard</p>
        </div>

        {/* ফর্ম */}
        <Form className="flex flex-col gap-4" onSubmit={onSubmit}>
          
          {/* ইমেইল ফিল্ড */}
          <TextField isRequired name="email" type="email">
            <Label className="text-sm font-medium text-slate-700">Email Address</Label>
            <input
              name="email"
              type="email"
              required
              placeholder="name@example.com"
              className="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none transition-all text-sm"
            />
            <FieldError className="mt-1 text-xs text-rose-500" />
          </TextField>

          {/* পাসওয়ার্ড ফিল্ড */}
          <TextField isRequired name="password">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-slate-700">Password</Label>
              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <div className="relative mt-1.5 flex items-center">
              <input
                name="password"
                type={isVisible ? "text" : "password"}
                required
                placeholder="Enter your password"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 pe-12 text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none transition-all text-sm"
              />
              <button
                type="button"
                className="absolute right-3 text-slate-400 hover:text-slate-600 p-1"
                onClick={() => setIsVisible(!isVisible)}
              >
                {isVisible ? <Eye className="size-5" /> : <EyeSlash className="size-5" />}
              </button>
            </div>
            <FieldError className="mt-1 text-xs text-rose-500" />
          </TextField>

          {/* সাবমিট বাটন */}
          <Button
            type="submit"
            disabled={loading}
            className="mt-2 w-full cursor-pointer rounded-xl bg-indigo-600 py-3 font-semibold text-white shadow-sm hover:bg-indigo-500 transition-all flex items-center justify-center gap-2"
          >
            {loading ? "Signing in..." : "Sign In"}
            {!loading && <ArrowRight className="size-4" />}
          </Button>
        </Form>

        {/* সেপারেটর (Tailwind হেক্স ও আর্বিট্রিয়ারি ওয়ার্নিং মুক্ত h-px) */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200"></div>
          <span className="text-xs uppercase tracking-wider text-slate-400">or continue with</span>
          <div className="h-px flex-1 bg-slate-200"></div>
        </div>

        {/* সোশ্যাল সাইন-ইন বাটন */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            className="w-full rounded-xl border border-slate-300 bg-white py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
            onClick={handleGoogleSignIn}
          >
            Google
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full rounded-xl border border-slate-300 bg-white py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
            onClick={handleGithubSignIn}
          >
            GitHub
          </Button>
        </div>

        {/* সাইন-আপ লিংক */}
        <p className="mt-6 text-center text-xs text-slate-500">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Create an account
          </Link>
        </p>

      </Card>
    </div>
  );
};

export default SignInPage;