import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

// কাস্টম ইউজার আইডি জেনারেটর (e.g., M-0042, A-0001)
function formatDisplayUserId(id, role = "member") {
  if (!id) return "N/A";
  const prefix = role ? role.charAt(0).toUpperCase() : "M";
  const shortNum = parseInt(id.slice(-4), 16) % 10000;
  return `${prefix}-${String(shortNum).padStart(4, "0")}`;
}

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    redirect("/sign-in");
  }

  const { user } = session;
  const isVerified = Boolean(user.emailVerified);
  const formattedId = formatDisplayUserId(user.id, user.role);

  return (
    <div className="flex min-h-[85vh] flex-col p-6 max-w-6xl mx-auto w-full">
      {/* হেডার */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Welcome back, <span className="text-indigo-600">{user.name || "User"}</span>! 👋
          </h1>
          <p className="mt-1 text-sm text-slate-500 font-medium">
            {"Here is what's happening with your account today."}
          </p>
        </div>
        <div>
          <Link
            href="/profile"
            className="inline-flex items-center rounded-xl bg-indigo-50 border border-indigo-200 px-5 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
          >
            Manage Profile
          </Link>
        </div>
      </div>

      {/* মেট্রিক কার্ডস (ভেরিফাইড হলে Green, আনভেরিফাইড হলে Alert Red) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
        
        {/* কার্ড ১: Account Status (ডাইনামিক কালার) */}
        <div
          className={`rounded-2xl border p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 ${
            isVerified
              ? "border-emerald-200 bg-emerald-50/70"
              : "border-rose-300 bg-rose-50/80"
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-bold uppercase tracking-wider ${
                isVerified ? "text-emerald-800" : "text-rose-800"
              }`}
            >
              Account Status
            </span>
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm ${
                isVerified
                  ? "bg-emerald-500 shadow-emerald-500/30"
                  : "bg-rose-500 shadow-rose-500/30"
              }`}
            >
              {isVerified ? "✉️" : "⚠️"}
            </div>
          </div>
          <p className="mt-4 text-xl font-bold text-slate-900 truncate">{user.email}</p>
          <div className="mt-3">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${
                isVerified
                  ? "bg-emerald-200/80 text-emerald-900 border border-emerald-300"
                  : "bg-rose-100 text-rose-900 border border-rose-300 animate-pulse"
              }`}
            >
              {isVerified ? "● Verified" : "✕ Action Required (Unverified)"}
            </span>
          </div>
        </div>

        {/* কার্ড ২: User Role */}
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50/70 p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-800">
              User Role
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-600/30">
              🛡️
            </div>
          </div>
          <p className="mt-4 text-2xl font-extrabold capitalize text-slate-900">{user.role || "Member"}</p>
          <span className="mt-2 block text-xs font-semibold text-indigo-700">
            Standard Access Privilege
          </span>
        </div>

        {/* কার্ড ৩: Security Check (ডাইনামিক কালার) */}
        <div
          className={`rounded-2xl border p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 ${
            isVerified
              ? "border-purple-200 bg-purple-50/70"
              : "border-amber-300 bg-amber-50/80"
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-bold uppercase tracking-wider ${
                isVerified ? "text-purple-800" : "text-amber-800"
              }`}
            >
              Security Check
            </span>
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm ${
                isVerified
                  ? "bg-purple-600 shadow-purple-600/30"
                  : "bg-amber-500 shadow-amber-500/30"
              }`}
            >
              {isVerified ? "🔒" : "🔓"}
            </div>
          </div>
          <p
            className={`mt-4 text-2xl font-extrabold ${
              isVerified ? "text-purple-900" : "text-amber-900"
            }`}
          >
            {isVerified ? "Protected" : "Vulnerable"}
          </p>
          <span
            className={`mt-2 block text-xs font-semibold ${
              isVerified ? "text-purple-700" : "text-amber-700"
            }`}
          >
            {isVerified
              ? "Session Authenticated Securely"
              : "Please verify email to protect account"}
          </span>
        </div>

      </div>

      {/* বিস্তারিত ইউজার ইনফো বক্স */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span>📋</span> Account Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <span className="text-slate-500 text-xs font-semibold uppercase block mb-1">Full Name</span>
            <p className="font-bold text-slate-800 text-base">{user.name || "N/A"}</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <span className="text-slate-500 text-xs font-semibold uppercase block mb-1">User ID</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-3 py-0.5 rounded-lg">
                {formattedId}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <span className="text-slate-500 text-xs font-semibold uppercase block mb-1">Email Status</span>
            <span
              className={`inline-flex items-center gap-1 font-bold text-sm px-2.5 py-0.5 rounded-lg mt-0.5 ${
                isVerified
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                  : "bg-rose-100 text-rose-800 border border-rose-200"
              }`}
            >
              {isVerified ? "✓ Verified Account" : "⚠ Pending Confirmation"}
            </span>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <span className="text-slate-500 text-xs font-semibold uppercase block mb-1">Joined Date</span>
            <p className="font-bold text-slate-800">
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Just now"}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}