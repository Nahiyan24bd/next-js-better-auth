import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const reqHeaders = await headers();
    
    // ১. ইউজার সেশন চেক করা
    const session = await auth.api.getSession({
      headers: reqHeaders,
    });

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "অননুমোদিত অ্যাক্সেস! দয়া করে আবার লগইন করুন।" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, password } = body;

    if (!name || name.trim().length < 3) {
      return NextResponse.json(
        { error: "নাম কমপক্ষে ৩ অক্ষরের হতে হবে।" },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { error: "বর্তমান পাসওয়ার্ড দেওয়া বাধ্যতামূলক!" },
        { status: 400 }
      );
    }

    // ২. BetterAuth দিয়ে ইমেইল ও পাসওয়ার্ড যাচাই করা
    try {
      await auth.api.signInEmail({
        body: {
          email: session.user.email,
          password: password,
        },
      });
    } catch {
      return NextResponse.json(
        { error: "বর্তমান পাসওয়ার্ডটি সঠিক নয়!" },
        { status: 400 }
      );
    }

    // ৩. পাসওয়ার্ড সঠিক হলে ইউজারের নাম আপডেট করা
    await auth.api.updateUser({
      headers: reqHeaders,
      body: {
        name: name.trim(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "নাম সফলভাবে পরিবর্তন করা হয়েছে!",
    });
  } catch (error) {
    console.error("Update name API Error:", error);
    return NextResponse.json(
      { error: error.message || "সার্ভার এরর হয়েছে।" },
      { status: 500 }
    );
  }
}