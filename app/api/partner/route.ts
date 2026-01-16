import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function POST(req: Request) {
    try {
        const { name, email, company, message, partnershipType } = await req.json();

        // Validate basic fields
        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const subject = `New Partnership Inquiry: ${partnershipType || 'General'} from ${name}`;

        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #000; border-bottom: 2px solid #000; padding-bottom: 10px;">New Partnership Inquiry</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Company:</strong> ${company || 'N/A'}</p>
                <p><strong>Partnership Type:</strong> ${partnershipType || 'Not specified'}</p>
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px;">
                    <p><strong>Message:</strong></p>
                    <p style="white-space: pre-wrap;">${message}</p>
                </div>
                <p style="font-size: 12px; color: #666; margin-top: 30px; border-top: 1px solid #eee; pt-10px;">
                    This message was sent from the Partner With Us page on makers3d.in
                </p>
            </div>
        `;

        const result = await sendEmail({
            to: 'studio@makers3d.in',
            subject,
            html,
        });

        if (result.success) {
            return NextResponse.json({ message: 'Inquiry sent successfully' });
        } else {
            return NextResponse.json({ error: 'Failed to send inquiry' }, { status: 500 });
        }
    } catch (error) {
        console.error('Partner API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
