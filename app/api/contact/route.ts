import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

/** Escape user input before it is interpolated into the notification email. */
function esc(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, company, service, quantity, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email and project details are required.' },
        { status: 400 },
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 24px; border: 1px solid #eee;">
        <h2 style="color:#000; border-bottom:2px solid #000; padding-bottom:10px;">New Quote Request</h2>
        <p><strong>Name:</strong> ${esc(name)}</p>
        <p><strong>Email:</strong> ${esc(email)}</p>
        <p><strong>Phone:</strong> ${esc(phone) || 'Not provided'}</p>
        <p><strong>Company:</strong> ${esc(company) || 'Not provided'}</p>
        <p><strong>Service:</strong> ${esc(service) || 'Not specified'}</p>
        <p><strong>Quantity:</strong> ${esc(quantity) || 'Not specified'}</p>
        <div style="background:#f9f9f9; padding:16px; margin-top:20px;">
          <p><strong>Project details:</strong></p>
          <p style="white-space:pre-wrap;">${esc(message)}</p>
        </div>
        <p style="font-size:12px; color:#666; margin-top:28px; border-top:1px solid #eee; padding-top:10px;">
          Sent from the Contact page on makers3d.in
        </p>
      </div>
    `;

    const result = await sendEmail({
      to: 'studio@makers3d.in',
      subject: `Quote request: ${esc(service) || 'General'} — ${esc(name)}`,
      html,
    });

    if (!result.success) {
      return NextResponse.json({ error: 'Could not send your request.' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Request sent successfully' });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
