import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { buildEnquiryEmail } from "@/lib/email-template";

const resend = new Resend(process.env.RESEND_API_KEY);

const ALLOWED_SERVICES = ["Events", "Weddings", "People", "Brands"] as const;

interface EnquiryPayload {
  firstName: string;
  lastName: string;
  email: string;
  services: string[];
  message: string;
}

function sanitize(str: string): string {
  return str.replace(/[<>]/g, "").trim().slice(0, 1000);
}

function validatePayload(body: unknown): EnquiryPayload | null {
  if (!body || typeof body !== "object") return null;

  const { firstName, lastName, email, services, message } = body as Record<
    string,
    unknown
  >;

  if (typeof firstName !== "string" || !firstName.trim()) return null;
  if (typeof lastName !== "string" || !lastName.trim()) return null;
  if (
    typeof email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  )
    return null;
  if (!Array.isArray(services) || services.length === 0) return null;
  if (
    !services.every((s) =>
      ALLOWED_SERVICES.includes(s as (typeof ALLOWED_SERVICES)[number])
    )
  )
    return null;
  if (typeof message !== "string" || !message.trim()) return null;

  return {
    firstName: sanitize(firstName),
    lastName: sanitize(lastName),
    email: email.trim().slice(0, 254),
    services: services as string[],
    message: sanitize(message),
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = validatePayload(body);

    if (!data) {
      return NextResponse.json(
        { error: "Invalid form data" },
        { status: 400 }
      );
    }

    /*const { error } = await resend.emails.send({
      from: "LabStories Enquiry <enquiry@labstories.pt>",
      to: ["hello@labstories.pt"],
      replyTo: data.email,
      subject: `New enquiry from ${data.firstName} ${data.lastName}`,
      html: buildEnquiryEmail(data),
    });*/

    const { error } = await resend.emails.send({
      from: "LabStories Enquiry <onboarding@resend.dev>",
      to: ["goncalobisantos@gmail.com"],
      replyTo: data.email,
      subject: `New enquiry from ${data.firstName} ${data.lastName}`,
      html: buildEnquiryEmail(data),
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
