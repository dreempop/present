import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { email, message } = await req.json();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"C-Advisor" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "แจ้งเตือนภาษี",
      text: message,
    });

    return new Response(JSON.stringify({ success: true, message: "Email sent" }), {
      status: 200,
    });
  } catch (err) {
    console.error("sendReminder error:", err);
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
    });
  }
}
