"use client";

import { authClient } from "@/lib/auth-client";
import { Eye, EyeSlash, ArrowRight } from "@gravity-ui/icons";
import { Button, Card, FieldError, Form, Label, TextField } from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get("password")?.toString();
    const confirmPassword = formData.get("confirmPassword")?.toString();

    if (!newPassword || newPassword.length < 8) {
      alert("Password kompokkhe 8 ta character hote hobe!");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Dui password eksathe match korche na!");
      setLoading(false);
      return;
    }

    if (!token) {
      alert("Invalid ba expired reset token! Abar try korun.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await authClient.resetPassword({
        newPassword: newPassword,
        token: token,
      });

      if (error) {
        alert(error.message || "Password reset korte problem hoyeche!");
      } else {
        alert("Password successfully change hoyeche! Ekhon login korun.");
        router.push("/sign-in");
      }
    } catch (err) {
      console.error(err);
      alert("Server error hoyeche, abar try korun.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center p-4">
      <Card className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/90 p-8 shadow-xl">
        
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
            <span className="text-xl">🔒</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Create New Password</h2>
          <p className="mt-1 text-sm text-slate-400">Apnar account-er jonno notun password set korun.</p>
        </div>

        <Form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          
          {/* New Password */}
          <TextField isRequired name="password">
            <Label className="text-sm font-medium text-slate-300">New Password</Label>
            <div className="relative mt-1.5 flex items-center">
              <input
                name="password"
                type={isVisible ? "text" : "password"}
                required
                minLength={8}
                placeholder="At least 8 characters"
                className="w-full rounded-xl border border-slate-700 bg-slate-800/90 px-4 py-3 pe-12 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-all"
              />
              <button
                type="button"
                className="absolute right-3 text-slate-400 hover:text-white p-1"
                onClick={() => setIsVisible(!isVisible)}
              >
                {isVisible ? <Eye className="size-5" /> : <EyeSlash className="size-5" />}
              </button>
            </div>
            <FieldError className="mt-1 text-xs text-rose-400" />
          </TextField>

          {/* Confirm Password */}
          <TextField isRequired name="confirmPassword">
            <Label className="text-sm font-medium text-slate-300">Confirm Password</Label>
            <input
              name="confirmPassword"
              type="password"
              required
              minLength={8}
              placeholder="Re-enter password"
              className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-800/90 px-4 py-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-all"
            />
            <FieldError className="mt-1 text-xs text-rose-400" />
          </TextField>

          <Button
            type="submit"
            disabled={loading}
            className="mt-3 w-full cursor-pointer rounded-xl bg-indigo-600 py-3 font-semibold text-white shadow-md transition-all hover:bg-indigo-500 flex items-center justify-center gap-2"
          >
            {loading ? "Updating..." : "Reset Password"}
            {!loading && <ArrowRight className="size-4" />}
          </Button>
        </Form>

      </Card>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-center p-10 text-slate-400">Loading form...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}