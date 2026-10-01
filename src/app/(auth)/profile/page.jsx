"use client";

import { authClient } from "@/lib/auth-client";
import {
  ChevronDown,
  ChevronUp,
  FloppyDisk,
  Key,
  Pencil,
  Person,
  ShieldCheck,
  TriangleExclamation,
} from "@gravity-ui/icons";
import {
  Button,
  Card,
  Chip,
  Description,
  FieldError,
  Fieldset,
  Form,
  Input,
  Label,
  Surface,
  TextField,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  // লোডিং ও টগল স্টেট
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [resendEmailLoading, setResendEmailLoading] = useState(false);
  const [emailChangeLoading, setEmailChangeLoading] = useState(false);

  // 🔹 শুধুমাত্র বাটনে চাপ দিলে টোগল ওপেন হওয়ার স্টেট
  const [showNameCard, setShowNameCard] = useState(false);
  const [showPasswordCard, setShowPasswordCard] = useState(false);
  const [showEmailChangeModal, setShowEmailChangeModal] = useState(false);

  // লগইন না থাকলে সাইন-ইন পেজে পাঠানো
  useEffect(() => {
    if (!isPending && !session) {
      router.push("/sign-in");
    }
  }, [session, isPending, router]);

  if (isPending || !session) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <p className="text-slate-500 font-medium">Loading profile details...</p>
      </div>
    );
  }

  const user = session.user;
  const isEmailVerified = user?.emailVerified;
  const isActive = true;

  // ১. নাম পরিবর্তনের হ্যান্ডলার
  const handleUpdateName = async (e) => {
    e.preventDefault();
    setProfileLoading(true);

    const formData = new FormData(e.currentTarget);
    const newName = formData.get("name")?.toString().trim();

    if (!newName || newName.length < 3) {
      alert("নাম কমপক্ষে ৩ অক্ষরের হতে হবে!");
      setProfileLoading(false);
      return;
    }

    try {
      const { error } = await authClient.updateUser({
        name: newName,
      });

      if (error) {
        alert(error.message || "নাম পরিবর্তন করা সম্ভব হয়নি!");
      } else {
        alert("নাম সফলভাবে আপডেট হয়েছে!");
        setShowNameCard(false);
        window.location.reload();
      }
    } catch (err) {
      console.error("Update Name Error:", err);
      alert("সার্ভারে সমস্যা হয়েছে, আবার চেষ্টা করুন।");
    } finally {
      setProfileLoading(false);
    }
  };

  // ২. পাসওয়ার্ড পরিবর্তনের হ্যান্ডলার
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);

    const formData = new FormData(e.currentTarget);
    const currentPassword = formData.get("currentPassword")?.toString();
    const newPassword = formData.get("newPassword")?.toString();
    const confirmPassword = formData.get("confirmPassword")?.toString();

    if (!currentPassword) {
      alert("বর্তমান পাসওয়ার্ডটি লিখুন!");
      setPasswordLoading(false);
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      alert("নতুন পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে!");
      setPasswordLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("নতুন পাসওয়ার্ড দুটি মিলছে না!");
      setPasswordLoading(false);
      return;
    }

    try {
      const { error } = await authClient.changePassword({
        currentPassword: currentPassword,
        newPassword: newPassword,
        revokeOtherSessions: true,
      });

      if (error) {
        alert(error.message || "পাসওয়ার্ড আপডেট ব্যর্থ হয়েছে! বর্তমান পাসওয়ার্ডটি সঠিক কিনা পরীক্ষা করুন।");
      } else {
        alert("পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে!");
        e.target.reset();
        setShowPasswordCard(false);
      }
    } catch (err) {
      console.error("Change Password Error:", err);
      alert("সার্ভারে সমস্যা হয়েছে, আবার চেষ্টা করুন।");
    } finally {
      setPasswordLoading(false);
    }
  };

  // ৩. ইমেইল ভেরিফিকেশন পাঠানো
  const handleResendVerification = async () => {
    setResendEmailLoading(true);
    try {
      const { error } = await authClient.sendVerificationEmail({
        email: user.email,
        callbackURL: "/profile",
      });

      if (error) {
        alert(error.message || "ভেরিফিকেশন লিংক পাঠানো ব্যর্থ হয়েছে!");
      } else {
        alert("আপনার ইমেইলে ভেরিফিকেশন লিংক পাঠিয়ে দেওয়া হয়েছে!");
      }
    } catch (err) {
      console.error(err);
      alert("সমস্যা হয়েছে, পরে চেষ্টা করুন।");
    } finally {
      setResendEmailLoading(false);
    }
  };

  // ৪. ইমেইল পরিবর্তনের হ্যান্ডলার
  const handleChangeEmailSubmit = async (e) => {
    e.preventDefault();
    setEmailChangeLoading(true);

    const formData = new FormData(e.currentTarget);
    const newEmail = formData.get("newEmail")?.toString().trim();

    if (!newEmail) {
      alert("দয়া করে নতুন ইমেইল লিখুন!");
      setEmailChangeLoading(false);
      return;
    }

    try {
      const { error } = await authClient.changeEmail({
        newEmail: newEmail,
        callbackURL: "/profile",
      });

      if (error) {
        alert(error.message || "ইমেইল পরিবর্তনের রিকোয়েস্ট ব্যর্থ হয়েছে!");
      } else {
        alert("নতুন ইমেইলে একটি ভেরিফিকেশন পাঠানো হয়েছে। কনফার্ম করলেই ইমেইল পরিবর্তন সম্পন্ন হবে।");
        setShowEmailChangeModal(false);
      }
    } catch (err) {
      console.error(err);
      alert("সমস্যা হয়েছে, পরে চেষ্টা করুন।");
    } finally {
      setEmailChangeLoading(false);
    }
  };

  return (
    <div className="flex min-h-[85vh] flex-col items-center justify-start p-4 md:p-8">
      <div className="w-full max-w-5xl flex flex-col gap-6">

        {/* আনভেরিফাইড নোটিফিকেশন ব্যানার */}
        {isActive && !isEmailVerified && (
          <div className="w-full rounded-2xl border border-amber-300 bg-amber-50 p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-amber-500/20 p-2.5 text-amber-700">
                <TriangleExclamation className="text-xl" />
              </div>
              <div>
                <h4 className="font-bold text-amber-900">ইমেইল ভেরিফিকেশন বাকি রয়েছে!</h4>
                <p className="text-xs text-amber-800">
                  আপনার অ্যাকাউন্ট সুরক্ষার জন্য <span className="font-semibold underline">{user?.email}</span> ইমেইলটি ভেরিফাই করুন।
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <Button
                size="sm"
                disabled={resendEmailLoading}
                className="bg-amber-600 text-white font-semibold text-xs rounded-xl px-4 py-2 hover:bg-amber-500 transition-all cursor-pointer shadow-sm"
                onClick={handleResendVerification}
              >
                {resendEmailLoading ? "পাঠানো হচ্ছে..." : "Verify Email"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border border-amber-300 bg-white text-amber-900 font-semibold text-xs rounded-xl px-4 py-2 hover:bg-amber-100 transition-all cursor-pointer"
                onClick={() => setShowEmailChangeModal(true)}
              >
                Change Email
              </Button>
            </div>
          </div>
        )}

        {/* ইমেইল চেঞ্জ মডাল */}
        {showEmailChangeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <Surface className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
              <Form onSubmit={handleChangeEmailSubmit}>
                <Fieldset className="w-full">
                  <Fieldset.Legend className="text-lg font-bold text-slate-900 mb-1">
                    Update Email Address
                  </Fieldset.Legend>
                  <Description className="text-xs text-slate-500 mb-4 block">
                    নতুন ইমেইল দিলে সেখানে একটি নিশ্চিতকরণ লিংক পাঠানো হবে।
                  </Description>

                  <Fieldset.Group className="space-y-4">
                    <TextField isRequired name="newEmail" type="email">
                      <Label className="text-sm font-medium text-slate-700">New Email</Label>
                      <Input
                        placeholder="new-email@example.com"
                        className="mt-1.5 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl py-2 px-3 focus:border-indigo-600 focus:bg-white text-sm"
                      />
                    </TextField>
                  </Fieldset.Group>

                  <Fieldset.Actions className="mt-6 flex gap-3">
                    <Button
                      type="submit"
                      disabled={emailChangeLoading}
                      className="flex-1 bg-indigo-600 text-white font-semibold rounded-xl py-2.5 cursor-pointer hover:bg-indigo-500 text-sm"
                    >
                      {emailChangeLoading ? "পাঠানো হচ্ছে..." : "Send Verification"}
                    </Button>
                    <Button
                      type="button"
                      variant="tertiary"
                      className="rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 px-4 text-sm"
                      onClick={() => setShowEmailChangeModal(false)}
                    >
                      Cancel
                    </Button>
                  </Fieldset.Actions>
                </Fieldset>
              </Form>
            </Surface>
          </div>
        )}

        {/* ২-কলামের ক্লিন গ্রিড */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* বাম সাইড: USER OVERVIEW */}
          <div className="lg:col-span-5 lg:sticky lg:top-8">
            <Card className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <Person className="text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">User Overview</h3>
                    <p className="text-xs text-slate-500 font-medium">Account status & info</p>
                  </div>
                </div>
                
                <Chip
                  className={`border px-3 py-1 text-xs font-semibold rounded-full ${
                    isActive
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-rose-200 bg-rose-50 text-rose-700"
                  }`}
                >
                  ● Active: {isActive ? "Yes" : "No"}
                </Chip>
              </div>

              <div className="mt-6 space-y-4 text-sm">
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">Display Name</span>
                  <span className="font-bold text-slate-800 text-base">{user?.name || "N/A"}</span>
                </div>

                <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">Email Address</span>
                  <span className="font-bold text-slate-800 text-sm break-all">{user?.email || "N/A"}</span>
                </div>

                <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">Email Status</span>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      isEmailVerified 
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300" 
                        : "bg-amber-100 text-amber-800 border border-amber-300"
                    }`}>
                      {isEmailVerified ? "Verified ✓" : "Unverified ✕"}
                    </span>
                  </div>

                  {!isEmailVerified && (
                    <Button
                      size="sm"
                      disabled={resendEmailLoading}
                      className="bg-indigo-600 text-xs text-white rounded-lg px-3 py-1.5 hover:bg-indigo-500 cursor-pointer"
                      onClick={handleResendVerification}
                    >
                      {resendEmailLoading ? "Sending..." : "Verify"}
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-indigo-50 border border-indigo-100 p-3 text-xs font-medium text-indigo-700">
                  <ShieldCheck className="text-indigo-600 text-base shrink-0" />
                  <span>আপনার অ্যাকাউন্টটি সম্পূর্ণ সুরক্ষিত রয়েছে।</span>
                </div>
              </div>
            </Card>
          </div>

          {/* ডান সাইড: পরিচ্ছন্ন বাটন গ্রিড এবং ক্লিক করলে ড্রপডাউন/টোগল */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            
            {/* ১. নেম চেঞ্জ টোগল কার্ড */}
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowNameCard((prev) => !prev);
                  if (!showNameCard) setShowPasswordCard(false); // একটি খুললে অন্যটি বন্ধ
                }}
                className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 text-slate-700 shadow-sm hover:border-indigo-300 hover:bg-indigo-50/30 transition-all cursor-pointer text-left"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <Pencil className="text-lg" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">Change Display Name</h4>
                    <p className="text-xs text-slate-500">প্রোফাইলের ডিসপ্লে নাম আপডেট করুন</p>
                  </div>
                </div>
                <div className="text-slate-400">
                  {showNameCard ? <ChevronUp className="size-5" /> : <ChevronDown className="size-5" />}
                </div>
              </button>

              {/* টোগল ফর্ম: নেম চেঞ্জ */}
              {showNameCard && (
                <Surface className="w-full rounded-2xl border border-indigo-100 bg-white p-6 shadow-md transition-all">
                  <Form onSubmit={handleUpdateName}>
                    <Fieldset className="w-full">
                      <Fieldset.Legend className="text-base font-bold text-slate-900 mb-1">
                        Enter New Name
                      </Fieldset.Legend>
                      <Description className="text-xs text-slate-500 mb-4 block">
                        নতুন যে নামটি দেখাতে চান সেটি লিখুন।
                      </Description>

                      <Fieldset.Group className="space-y-4">
                        <TextField
                          isRequired
                          name="name"
                          defaultValue={user?.name || ""}
                        >
                          <Label className="text-sm font-medium text-slate-700">Display Name</Label>
                          <Input
                            placeholder="Your new name"
                            className="mt-1.5 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl focus:border-indigo-600 focus:bg-white py-2.5 px-3 text-sm"
                          />
                        </TextField>
                      </Fieldset.Group>

                      <Fieldset.Actions className="mt-5 flex gap-3">
                        <Button
                          type="submit"
                          disabled={profileLoading}
                          className="flex-1 bg-indigo-600 font-semibold text-white shadow-sm hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 py-2.5 rounded-xl cursor-pointer text-sm"
                        >
                          <FloppyDisk />
                          {profileLoading ? "Updating..." : "Save Name"}
                        </Button>
                        <Button
                          type="button"
                          className="rounded-xl border border-slate-300 bg-white px-4 text-slate-700 hover:bg-slate-100 cursor-pointer text-sm"
                          onClick={() => setShowNameCard(false)}
                        >
                          Cancel
                        </Button>
                      </Fieldset.Actions>
                    </Fieldset>
                  </Form>
                </Surface>
              )}
            </div>

            {/* ২. পাসওয়ার্ড চেঞ্জ টোগল কার্ড */}
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowPasswordCard((prev) => !prev);
                  if (!showPasswordCard) setShowNameCard(false); // একটি খুললে অন্যটি বন্ধ
                }}
                className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 text-slate-700 shadow-sm hover:border-indigo-300 hover:bg-indigo-50/30 transition-all cursor-pointer text-left"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                    <Key className="text-lg" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">Change Account Password</h4>
                    <p className="text-xs text-slate-500">পুরোনো ও নতুন পাসওয়ার্ড দিয়ে সুরক্ষিত করুন</p>
                  </div>
                </div>
                <div className="text-slate-400">
                  {showPasswordCard ? <ChevronUp className="size-5" /> : <ChevronDown className="size-5" />}
                </div>
              </button>

              {/* টোগল ফর্ম: পাসওয়ার্ড চেঞ্জ */}
              {showPasswordCard && (
                <Surface className="w-full rounded-2xl border border-purple-100 bg-white p-6 shadow-md transition-all">
                  <Form onSubmit={handleChangePassword}>
                    <Fieldset className="w-full">
                      <Fieldset.Legend className="text-base font-bold text-slate-900 mb-1">
                        Update Password
                      </Fieldset.Legend>
                      <Description className="text-xs text-slate-500 mb-4 block">
                        বর্তমান পাসওয়ার্ড যাচাই করে নতুন পাসওয়ার্ড সেট করুন।
                      </Description>

                      <Fieldset.Group className="space-y-4">
                        <TextField isRequired name="currentPassword" type="password">
                          <Label className="text-sm font-medium text-slate-700">Old Password</Label>
                          <Input
                            placeholder="Enter current password"
                            className="mt-1.5 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl focus:border-indigo-600 focus:bg-white py-2.5 px-3 text-sm"
                          />
                        </TextField>

                        <TextField isRequired name="newPassword" type="password" minLength={8}>
                          <Label className="text-sm font-medium text-slate-700">New Password</Label>
                          <Input
                            placeholder="Minimum 8 characters"
                            className="mt-1.5 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl focus:border-indigo-600 focus:bg-white py-2.5 px-3 text-sm"
                          />
                        </TextField>

                        <TextField isRequired name="confirmPassword" type="password" minLength={8}>
                          <Label className="text-sm font-medium text-slate-700">Confirm New Password</Label>
                          <Input
                            placeholder="Re-enter new password"
                            className="mt-1.5 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl focus:border-indigo-600 focus:bg-white py-2.5 px-3 text-sm"
                          />
                        </TextField>
                      </Fieldset.Group>

                      <Fieldset.Actions className="mt-5 flex gap-3">
                        <Button
                          type="submit"
                          disabled={passwordLoading}
                          className="flex-1 bg-indigo-600 font-semibold text-white shadow-sm hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 py-2.5 rounded-xl cursor-pointer text-sm"
                        >
                          <FloppyDisk />
                          {passwordLoading ? "Updating..." : "Confirm & Update"}
                        </Button>
                        <Button
                          type="button"
                          className="rounded-xl border border-slate-300 bg-white px-4 text-slate-700 hover:bg-slate-100 cursor-pointer text-sm"
                          onClick={() => setShowPasswordCard(false)}
                        >
                          Cancel
                        </Button>
                      </Fieldset.Actions>
                    </Fieldset>
                  </Form>
                </Surface>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}