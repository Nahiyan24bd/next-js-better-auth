"use client";

import { signIn, signUp } from "@/lib/auth-client";
import { Eye, EyeSlash, ArrowRight } from "@gravity-ui/icons";
import {
  Button,
  Card,
  Description,
  FieldError,
  Form,
  Input,
  InputGroup,
  Label,
  TextField,
} from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SignUpPage = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // ১. ইমেইল, নাম ও পাসওয়ার্ড দিয়ে সাইন-আপ
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const { data: resData, error } = await signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
        callbackURL: "/profile",
      });

      if (error) {
        alert(error.message || "সাইন-আপ ব্যর্থ হয়েছে!");
      } else {
        alert("অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!");
        router.push("/profile");
        router.refresh();
      }
    } catch (err) {
      console.error("Sign-up error:", err);
      alert("সার্ভারে সমস্যা হয়েছে, আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  // ২. সোশ্যাল সাইন-আপ (Google)
  const handleGoogleSignIn = async () => {
    await signIn.social({
      provider: "google",
      callbackURL: "/profile",
    });
  };

  // ৩. সোশ্যাল সাইন-আপ (GitHub)
  const handleGithubSignIn = async () => {
    await signIn.social({
      provider: "github",
      callbackURL: "/profile",
    });
  };

return (
    <div className="flex min-h-[85vh] items-center justify-center p-4">
      <Card className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        
        {/* হেডার */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <span className="text-xl font-bold">✨</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Create an Account</h2>
          <p className="mt-1 text-sm text-slate-500">Join us to start managing your profile</p>
        </div>

        {/* সাইন-আপ ফর্ম */}
        <Form className="flex flex-col gap-4" onSubmit={onSubmit}>
          
          {/* নাম ফিল্ড */}
          <TextField
            isRequired
            name="name"
            validate={(value) => {
              if (value.length < 3) {
                return "নাম কমপক্ষে ৩ অক্ষরের হতে হবে";
              }
              return null;
            }}
          >
            <Label className="text-sm font-medium text-slate-700">Full Name</Label>
            <Input
              placeholder="John Doe"
              className="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:bg-white text-sm"
            />
            <FieldError className="mt-1 text-xs text-rose-500" />
          </TextField>

          {/* ইমেইল ফিল্ড */}
          <TextField
            isRequired
            name="email"
            type="email"
            validate={(value) => {
              if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                return "সঠিক ইমেইল ঠিকানা দিন";
              }
              return null;
            }}
          >
            <Label className="text-sm font-medium text-slate-700">Email Address</Label>
            <Input
              placeholder="name@example.com"
              className="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:bg-white text-sm"
            />
            <FieldError className="mt-1 text-xs text-rose-500" />
          </TextField>

          {/* পাসওয়ার্ড ফিল্ড (Eye Icon টগলসহ) */}
          <TextField
            isRequired
            name="password"
            validate={(value) => {
              if (value.length < 8) {
                return "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে";
              }
              if (!/[A-Z]/.test(value)) {
                return "কমপক্ষে একটি বড় হাতের অক্ষর (A-Z) থাকতে হবে";
              }
              if (!/[0-9]/.test(value)) {
                return "কমপক্ষে একটি সংখ্যা (0-9) থাকতে হবে";
              }
              return null;
            }}
          >
            <Label className="text-sm font-medium text-slate-700">Password</Label>
            <InputGroup className="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-50 focus-within:border-indigo-600 focus-within:bg-white">
              <InputGroup.Input
                name="password"
                type={isVisible ? "text" : "password"}
                placeholder="Create a password"
                className="w-full bg-transparent px-3.5 py-2.5 text-slate-900 placeholder-slate-400 outline-none text-sm"
              />
              <InputGroup.Suffix className="pe-2">
                <Button
                  type="button"
                  isIconOnly
                  size="sm"
                  variant="ghost"
                  className="text-slate-400 hover:text-slate-600"
                  onPress={() => setIsVisible(!isVisible)}
                >
                  {isVisible ? <Eye className="size-4" /> : <EyeSlash className="size-4" />}
                </Button>
              </InputGroup.Suffix>
            </InputGroup>
            <Description className="text-xs text-slate-500 mt-1">
              Must be at least 8 characters with 1 uppercase & 1 number
            </Description>
            <FieldError className="mt-1 text-xs text-rose-500" />
          </TextField>

          {/* সাবমিট বাটন */}
          <Button
            type="submit"
            disabled={loading}
            className="mt-3 w-full cursor-pointer rounded-xl bg-indigo-600 py-3 font-semibold text-white shadow-sm hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 text-sm"
          >
            {loading ? "Creating account..." : "Sign Up"}
            {!loading && <ArrowRight className="size-4" />}
          </Button>
        </Form>

        {/* সেপারেটর */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200"></div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">or sign up with</span>
          <div className="h-px flex-1 bg-slate-200"></div>
        </div>

        {/* সোশাল সাইন-আপ বাটনসমূহ */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            className="w-full rounded-xl border border-slate-300 bg-white py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
            onClick={handleGoogleSignIn}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Google
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full rounded-xl border border-slate-300 bg-white py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
            onClick={handleGithubSignIn}
          >
            <svg className="h-4 w-4 fill-slate-800" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub
          </Button>
        </div>

        {/* সাইন-ইন লিংক */}
        <p className="mt-6 text-center text-xs text-slate-500">
          Already have an account?{" "}
          <Link href="/sign-in" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Sign In
          </Link>
        </p>

      </Card>
    </div>
  );
};

export default SignUpPage;