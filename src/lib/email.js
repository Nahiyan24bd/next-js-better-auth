import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export const sendEmail = async ({ to, subject, text, html }) => {
  // 👉 ডেভেলপমেন্টের সুবিধার্থে টার্মিনালে সবসময় লিংক প্রিন্ট করে দেখানো
  console.log("==========================================");
  console.log(`📨 [SENDING EMAIL]`);
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Message / Link:`);
  console.log(text || html);
  console.log("==========================================");

  if (!resend) return;

  try {
    const data = await resend.emails.send({
      from: "ACME <onboarding@resend.dev>",
      to: [to],
      subject: subject,
      text: text,
      html: html,
    });
    console.log("Resend Success:", data);
    return data;
  } catch (error) {
    console.error("Resend Sending Failed (Free Tier Restriction):", error.message);
  }
};