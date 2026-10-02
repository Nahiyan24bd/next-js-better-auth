import React from "react";
import Link from "next/link";

const HomePage = () => {
  return (
    <div className="min-h-[88vh] flex flex-col justify-between max-w-6xl mx-auto px-6 py-12">
      {/* 🚀 Hero Section */}
      <div className="flex flex-col items-center text-center my-auto py-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold tracking-wide uppercase mb-6">
          <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></span>
          Next-Gen Authentication System
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 max-w-4xl">
          Secure, Scalable & Modern{" "}
          <span className="text-indigo-600 bg-clip-text">User Management</span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl font-medium leading-relaxed">
          BetterAuth এবং Next.js দিয়ে তৈরি আধুনিক অথেন্টিকেশন সিস্টেম। সম্পূর্ণ
          সুরক্ষিত সেশন ম্যানেজমেন্ট, ও-অথ (OAuth) এবং প্রোফাইল কন্ট্রোল সুবিধা।
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-500 transition-all hover:-translate-y-0.5"
          >
            Go to Dashboard →
          </Link>
          <Link
            href="/sign-in"
            className="rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-all"
          >
            Sign In / Register
          </Link>
        </div>
      </div>

      {/* 🍱 Modern Bento Grid Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-slate-200">
        
        {/* Feature 1 */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 shadow-sm hover:bg-white transition-all hover:shadow-md">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 text-xl font-bold">
            🛡️
          </div>
          <h3 className="mt-4 text-lg font-bold text-slate-900">BetterAuth Security</h3>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-normal">
            সুরক্ষিত কুকি এবং টোকেন ভিত্তিক অথেন্টিকেশন। সেশন ম্যানেজমেন্ট এবং ব্রুট-ফোর্স প্রটেকশন।
          </p>
        </div>

        {/* Feature 2 */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 shadow-sm hover:bg-white transition-all hover:shadow-md">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 text-xl font-bold">
            ⚡
          </div>
          <h3 className="mt-4 text-lg font-bold text-slate-900">Instant Verification</h3>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-normal">
            ইমেইল ভেরিফিকেশন স্ট্যাটাস ট্র্যাক ও নোটিফিকেশন অ্যালার্ট সিস্টেম অন্তর্ভুক্ত।
          </p>
        </div>

        {/* Feature 3 */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 shadow-sm hover:bg-white transition-all hover:shadow-md">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-700 text-xl font-bold">
            ⚙️
          </div>
          <h3 className="mt-4 text-lg font-bold text-slate-900">Profile Management</h3>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-normal">
            এক ক্লিকেই পাসওয়ার্ড ও নাম পরিবর্তন করার জন্য পরিচ্ছন্ন ও ড্রপডাউন ইন্টারফেস।
          </p>
        </div>

      </div>
    </div>
  );
};

export default HomePage;