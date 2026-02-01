import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const leadNotifyEmail = process.env.LEAD_NOTIFY_EMAIL;
const leadFromEmail = process.env.LEAD_FROM_EMAIL || "Burgundy Ventures <no-reply@burgundyventures.com>";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company } = body || {};

    if (!name || !email) {
      return NextResponse.json({ error: "Missing name or email." }, { status: 400 });
    }

    if (!resendApiKey || !leadNotifyEmail) {
      return NextResponse.json(
        { error: "Email service not configured." },
        { status: 500 }
      );
    }

    const resend = new Resend(resendApiKey);
    const subject = `New lead: ${name}`;
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>New Lead</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company / Brand:</strong> ${company || "—"}</p>
      </div>
    `;

    await resend.emails.send({
      from: leadFromEmail,
      to: [leadNotifyEmail],
      subject,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to send email." },
      { status: 500 }
    );
  }
}
