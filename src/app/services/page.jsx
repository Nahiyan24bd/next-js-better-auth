import React from "react";
import Link from "next/link";

const servicesList = [
  {
    id: 1,
    icon: "🔐",
    title: "Authentication & Security",
    description: "Multi-session login, password hashing, and token-based protection using BetterAuth.",
    tag: "Core",
    color: "indigo",
  },
  {
    id: 2,
    icon: "📧",
    title: "Email Verification & Alerts",
    description: "Automated verification mail delivery and instant status notifications for accounts.",
    tag: "Security",
    color: "emerald",
  },
  {
    id: 3,
    icon: "👥",
    title: "User Role Management",
    description: "Fine-grained role-based access control (Admin, Member) with granular permissions.",
    tag: "Management",
    color: "purple",
  },
  {
    id: 4,
    icon: "⚡",
    title: "API & OAuth Integration",
    description: "One-click authentication integration with Google, GitHub, and custom credentials.",
    tag: "Integration",
    color: "blue",
  },
  {
    id: 5,
    icon: "📊",
    title: "Analytics & Monitoring",
    description: "Real-time user session metrics, security health checks, and activity audit logs.",
    tag: "Analytics",
    color: "amber",
  },
  {
    id: 6,
    icon: "🛠️",
    title: "Custom Profile Controls",
    description: "Self-service account management, name editing, and instant credential resets.",
    tag: "Settings",
    color: "rose",
  },
];

export default function ServicesPage() {
  return (
    <div className="flex min-h-[85vh] flex-col p-6 max-w-6xl mx-auto w-full">
      {/* হেডার */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Our <span className="text-indigo-600">Services</span>
          </h1>
          <p className="mt-1 text-sm text-slate-500 font-medium">
            Explore the available features and solutions provided by our platform.
          </p>
        </div>
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center rounded-xl bg-indigo-50 border border-indigo-200 px-5 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>

      {/* সার্ভিস কার্ড গ্রিড */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
        {servicesList.map((service) => (
          <div
            key={service.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                  {service.icon}
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full border border-slate-200">
                  {service.tag}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{service.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{service.description}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer">
                Learn more →
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}