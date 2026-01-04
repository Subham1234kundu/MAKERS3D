import { sendEmail } from './email';
import {
    getEmailTemplate,
    getWelcomeEmailContent,
    getOrderConfirmationContent,
    getOrderShippedContent,
    getOrderDeliveredContent,
    getReturnConfirmedContent,
} from './email-templates';

// Send Welcome Email
export async function sendWelcomeEmail(params: {
    customerName: string;
    customerEmail: string;
}) {
    const content = getWelcomeEmailContent(params.customerName);
    const html = getEmailTemplate(content);

    return await sendEmail({
        to: params.customerEmail,
        subject: 'Welcome to MAKERS3D - Your Journey Begins',
        html,
    });
}

// Send Order Confirmation Email
export async function sendOrderConfirmationEmail(params: {
    customerName: string;
    customerEmail: string;
    orderId: string;
    amount: string;
    items: string;
    address: string;
    paymentMethod: string;
}) {
    const content = getOrderConfirmationContent({
        orderId: params.orderId,
        customerName: params.customerName,
        items: params.items,
        amount: params.amount,
        address: params.address,
        paymentMethod: params.paymentMethod,
    });
    const html = getEmailTemplate(content);

    return await sendEmail({
        to: params.customerEmail,
        subject: `Order Confirmed #${params.orderId} - MAKERS3D`,
        html,
    });
}

// Send Order Shipped Email
export async function sendOrderShippedEmail(params: {
    customerName: string;
    customerEmail: string;
    orderId: string;
    trackingNumber?: string;
}) {
    const content = getOrderShippedContent({
        orderId: params.orderId,
        customerName: params.customerName,
        trackingNumber: params.trackingNumber,
    });
    const html = getEmailTemplate(content);

    return await sendEmail({
        to: params.customerEmail,
        subject: `Your Order Has Shipped #${params.orderId} - MAKERS3D`,
        html,
    });
}

// Send Order Delivered Email
export async function sendOrderDeliveredEmail(params: {
    customerName: string;
    customerEmail: string;
    orderId: string;
}) {
    const content = getOrderDeliveredContent({
        orderId: params.orderId,
        customerName: params.customerName,
    });
    const html = getEmailTemplate(content);

    return await sendEmail({
        to: params.customerEmail,
        subject: `Order Delivered #${params.orderId} - MAKERS3D`,
        html,
    });
}

// Send Return Confirmed Email
export async function sendReturnConfirmedEmail(params: {
    customerName: string;
    customerEmail: string;
    orderId: string;
    returnId: string;
    reason?: string;
}) {
    const content = getReturnConfirmedContent({
        orderId: params.orderId,
        customerName: params.customerName,
        returnId: params.returnId,
        reason: params.reason,
    });
    const html = getEmailTemplate(content);

    return await sendEmail({
        to: params.customerEmail,
        subject: `Return Approved #${params.returnId} - MAKERS3D`,
        html,
    });
}

// Send Login Notification Email
export async function sendLoginNotificationEmail(params: {
    customerName: string;
    customerEmail: string;
    loginTime: Date;
    ipAddress?: string;
    device?: string;
}) {
    const content = `
        <div style="text-align: center; margin-bottom: 40px;">
            <div style="display: inline-block; background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); 
                        padding: 12px 25px; margin-bottom: 25px;">
                <p style="font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: #3b82f6; margin: 0;">
                    🔐 Security Alert
                </p>
            </div>
            <h1 style="font-size: 42px; font-weight: 100; letter-spacing: -0.02em; margin-bottom: 15px; color: #ffffff;">
                New Login Detected
            </h1>
            <p style="font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(255, 255, 255, 0.4);">
                Account Security Notification
            </p>
        </div>

        <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); padding: 35px; margin-bottom: 30px;">
            <p style="font-size: 16px; color: rgba(255, 255, 255, 0.9); margin-bottom: 20px; font-weight: 300;">
                Hello <strong style="color: #ffffff;">${params.customerName}</strong>,
            </p>
            <p style="font-size: 14px; color: rgba(255, 255, 255, 0.7); line-height: 1.8; margin-bottom: 15px;">
                We detected a new login to your MAKERS3D account. If this was you, you can safely ignore this email.
            </p>
        </div>

        <div style="background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%); 
                    border: 1px solid rgba(255, 255, 255, 0.05); padding: 30px; margin-bottom: 30px;">
            <h3 style="font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(255, 255, 255, 0.5); margin-bottom: 20px;">
                Login Details
            </h3>
            
            <div style="margin-bottom: 15px;">
                <p style="font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255, 255, 255, 0.4); margin-bottom: 5px;">
                    Time
                </p>
                <p style="font-size: 14px; color: rgba(255, 255, 255, 0.9); font-weight: 300;">
                    ${params.loginTime.toLocaleString('en-IN', {
        dateStyle: 'full',
        timeStyle: 'short',
        timeZone: 'Asia/Kolkata'
    })}
                </p>
            </div>

            ${params.device ? `
            <div style="margin-bottom: 15px;">
                <p style="font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255, 255, 255, 0.4); margin-bottom: 5px;">
                    Device
                </p>
                <p style="font-size: 14px; color: rgba(255, 255, 255, 0.9); font-weight: 300;">
                    ${params.device}
                </p>
            </div>
            ` : ''}

            ${params.ipAddress ? `
            <div style="margin-bottom: 15px;">
                <p style="font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255, 255, 255, 0.4); margin-bottom: 5px;">
                    IP Address
                </p>
                <p style="font-size: 14px; color: rgba(255, 255, 255, 0.9); font-weight: 300; font-family: 'Courier New', monospace;">
                    ${params.ipAddress}
                </p>
            </div>
            ` : ''}
        </div>

        <div style="background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.2); padding: 25px; margin-bottom: 30px;">
            <h3 style="font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(239, 68, 68, 0.8); margin-bottom: 15px;">
                ⚠ Wasn't You?
            </h3>
            <p style="font-size: 13px; color: rgba(255, 255, 255, 0.7); line-height: 1.8; margin-bottom: 20px;">
                If you didn't log in, please secure your account immediately by changing your password.
            </p>
            <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://makers3d.com'}/reset-password" 
               style="display: inline-block; background: rgba(239, 68, 68, 0.1); color: #ef4444; 
                      border: 1px solid rgba(239, 68, 68, 0.3); padding: 12px 30px; text-decoration: none; 
                      font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; font-weight: 700;">
                SECURE MY ACCOUNT
            </a>
        </div>

        <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid rgba(255, 255, 255, 0.05);">
            <p style="font-size: 11px; color: rgba(255, 255, 255, 0.4); text-align: center; line-height: 1.6;">
                Need help with your account?<br/>
                Contact us at <a href="mailto:support@makers3d.com" style="color: rgba(255, 255, 255, 0.6); text-decoration: none;">support@makers3d.com</a>
            </p>
        </div>
    `;

    const html = getEmailTemplate(content);

    return await sendEmail({
        to: params.customerEmail,
        subject: 'New Login to Your MAKERS3D Account',
        html,
    });
}
