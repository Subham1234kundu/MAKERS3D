// Base email template with MAKERS3D branding
export const getEmailTemplate = (content: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MAKERS3D</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            background-color: #000000;
            color: #ffffff;
            line-height: 1.6;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #000000;
        }
        .header {
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
            padding: 40px 30px;
            text-align: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .logo {
            max-width: 180px;
            height: auto;
            margin-bottom: 20px;
        }
        .header-title {
            font-size: 11px;
            letter-spacing: 0.3em;
            text-transform: uppercase;
            color: rgba(255, 255, 255, 0.4);
            font-weight: 700;
        }
        .content {
            padding: 50px 30px;
            background-color: #0a0a0a;
        }
        .footer {
            background-color: #050505;
            padding: 30px;
            text-align: center;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
        .footer-text {
            font-size: 9px;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            color: rgba(255, 255, 255, 0.2);
            margin-bottom: 15px;
        }
        .social-links {
            margin-top: 20px;
        }
        .social-links a {
            color: rgba(255, 255, 255, 0.3);
            text-decoration: none;
            margin: 0 10px;
            font-size: 10px;
            letter-spacing: 0.2em;
            text-transform: uppercase;
        }
        .divider {
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
            margin: 30px 0;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <img src="https://raw.githubusercontent.com/Subham1234kundu/MAKERS3D/main/public/images/logo.png" alt="MAKERS3D" class="logo" />
            <div class="header-title">Architectural Excellence</div>
        </div>
        <div class="content">
            ${content}
        </div>
        <div class="footer">
            <div class="footer-text">MAKERS3D • Built on Reliability • Secured Encryption</div>
            <div class="divider"></div>
            <div class="social-links">
                <a href="#">Instagram</a>
                <a href="#">Facebook</a>
                <a href="#">Twitter</a>
            </div>
            <div style="margin-top: 20px; font-size: 8px; color: rgba(255, 255, 255, 0.15); letter-spacing: 0.2em;">
                © ${new Date().getFullYear()} MAKERS3D. ALL RIGHTS RESERVED.
            </div>
        </div>
    </div>
</body>
</html>
`;

// Welcome Email Template
export const getWelcomeEmailContent = (name: string) => `
    <div style="text-align: center; margin-bottom: 40px;">
        <h1 style="font-size: 42px; font-weight: 100; letter-spacing: -0.02em; margin-bottom: 15px; color: #ffffff;">
            Welcome to MAKERS3D
        </h1>
        <p style="font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(255, 255, 255, 0.4);">
            Your Journey Begins Here
        </p>
    </div>

    <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); padding: 35px; margin-bottom: 30px;">
        <p style="font-size: 16px; color: rgba(255, 255, 255, 0.9); margin-bottom: 20px; font-weight: 300;">
            Hello <strong style="color: #ffffff;">${name}</strong>,
        </p>
        <p style="font-size: 14px; color: rgba(255, 255, 255, 0.7); line-height: 1.8; margin-bottom: 15px;">
            Thank you for joining MAKERS3D, where architectural precision meets cutting-edge 3D printing technology. 
            We're thrilled to have you as part of our community of creators and innovators.
        </p>
        <p style="font-size: 14px; color: rgba(255, 255, 255, 0.7); line-height: 1.8;">
            Your account has been successfully created. You can now explore our collection of premium 3D architectural models 
            and bring your visions to life.
        </p>
    </div>

    <div style="background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%); 
                border-left: 2px solid rgba(255, 255, 255, 0.2); padding: 25px; margin-bottom: 30px;">
        <h3 style="font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(255, 255, 255, 0.5); margin-bottom: 15px;">
            What's Next?
        </h3>
        <ul style="list-style: none; padding: 0;">
            <li style="font-size: 13px; color: rgba(255, 255, 255, 0.7); margin-bottom: 10px; padding-left: 20px; position: relative;">
                <span style="position: absolute; left: 0; color: rgba(255, 255, 255, 0.3);">→</span>
                Browse our curated collection of 3D models
            </li>
            <li style="font-size: 13px; color: rgba(255, 255, 255, 0.7); margin-bottom: 10px; padding-left: 20px; position: relative;">
                <span style="position: absolute; left: 0; color: rgba(255, 255, 255, 0.3);">→</span>
                Track your orders in real-time
            </li>
            <li style="font-size: 13px; color: rgba(255, 255, 255, 0.7); margin-bottom: 10px; padding-left: 20px; position: relative;">
                <span style="position: absolute; left: 0; color: rgba(255, 255, 255, 0.3);">→</span>
                Get exclusive updates on new arrivals
            </li>
        </ul>
    </div>

    <div style="text-align: center; margin-top: 40px;">
        <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://makers3d.com'}" 
           style="display: inline-block; background-color: #ffffff; color: #000000; 
                  padding: 15px 40px; text-decoration: none; font-size: 10px; 
                  letter-spacing: 0.3em; text-transform: uppercase; font-weight: 700;
                  transition: all 0.3s ease;">
            START EXPLORING
        </a>
    </div>

    <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid rgba(255, 255, 255, 0.05);">
        <p style="font-size: 11px; color: rgba(255, 255, 255, 0.4); text-align: center; line-height: 1.6;">
            Need help? Our support team is here for you.<br/>
            Contact us at <a href="mailto:support@makers3d.com" style="color: rgba(255, 255, 255, 0.6); text-decoration: none;">support@makers3d.com</a>
        </p>
    </div>
`;

// OTP Email Template
export const getOTPEmailContent = (name: string, otp: string) => `
    <div style="text-align: center; margin-bottom: 40px;">
        <h1 style="font-size: 42px; font-weight: 100; letter-spacing: -0.02em; margin-bottom: 15px; color: #ffffff;">
            Verification Code
        </h1>
        <p style="font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(255, 255, 255, 0.4);">
            Complete Your Registration
        </p>
    </div>

    <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); padding: 35px; margin-bottom: 30px;">
        <p style="font-size: 16px; color: rgba(255, 255, 255, 0.9); margin-bottom: 20px; font-weight: 300;">
            Hello <strong style="color: #ffffff;">${name}</strong>,
        </p>
        <p style="font-size: 14px; color: rgba(255, 255, 255, 0.7); line-height: 1.8; margin-bottom: 25px;">
            Welcome to MAKERS3D! To complete your signup and start your architectural journey, please use the following verification code:
        </p>
        
        <div style="text-align: center; padding: 30px; background: rgba(255, 255, 255, 0.03); border: 1px dashed rgba(255, 255, 255, 0.2); margin: 20px 0;">
            <span style="font-size: 48px; font-weight: 100; letter-spacing: 0.2em; color: #ffffff;">${otp}</span>
        </div>
        
        <p style="font-size: 12px; color: rgba(255, 255, 255, 0.4); text-align: center; margin-top: 20px;">
            This code will expire in 10 minutes.
        </p>
    </div>

    <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid rgba(255, 255, 255, 0.05);">
        <p style="font-size: 11px; color: rgba(255, 255, 255, 0.4); text-align: center; line-height: 1.6;">
            If you didn't request this code, you can safely ignore this email.<br/>
            Contact us at <a href="mailto:support@makers3d.com" style="color: rgba(255, 255, 255, 0.6); text-decoration: none;">support@makers3d.com</a>
        </p>
    </div>
`;

// Order Confirmation Email Template
export const getOrderConfirmationContent = (orderDetails: {
    orderId: string;
    customerName: string;
    items: string;
    address: string;
    paymentMethod: string;
}) => `
    <div style="text-align: center; margin-bottom: 40px;">
        <div style="display: inline-block; background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3); 
                    padding: 12px 25px; margin-bottom: 25px;">
            <p style="font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: #22c55e; margin: 0;">
                ✓ Order Confirmed
            </p>
        </div>
        <h1 style="font-size: 42px; font-weight: 100; letter-spacing: -0.02em; margin-bottom: 15px; color: #ffffff;">
            Thank You for Your Order
        </h1>
        <p style="font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(255, 255, 255, 0.4);">
            Order #${orderDetails.orderId}
        </p>
    </div>

    <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); padding: 35px; margin-bottom: 30px;">
        <p style="font-size: 16px; color: rgba(255, 255, 255, 0.9); margin-bottom: 20px; font-weight: 300;">
            Hello <strong style="color: #ffffff;">${orderDetails.customerName}</strong>,
        </p>
        <p style="font-size: 14px; color: rgba(255, 255, 255, 0.7); line-height: 1.8; margin-bottom: 15px;">
            We've received your order and it's being processed. You'll receive another email when your order has been shipped.
        </p>
    </div>

    <div style="background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%); 
                border: 1px solid rgba(255, 255, 255, 0.05); padding: 30px; margin-bottom: 30px;">
        <h3 style="font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(255, 255, 255, 0.5); margin-bottom: 20px;">
            Order Details
        </h3>
        
        <div style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
            <p style="font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255, 255, 255, 0.4); margin-bottom: 8px;">
                Items
            </p>
            <p style="font-size: 14px; color: rgba(255, 255, 255, 0.9); font-weight: 300;">
                ${orderDetails.items}
            </p>
        </div>

        <div style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
            <p style="font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255, 255, 255, 0.4); margin-bottom: 8px;">
                Shipping Address
            </p>
            <p style="font-size: 14px; color: rgba(255, 255, 255, 0.9); font-weight: 300; line-height: 1.6;">
                ${orderDetails.address}
            </p>
        </div>

        <div style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
            <p style="font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255, 255, 255, 0.4); margin-bottom: 8px;">
                Payment Method
            </p>
            <p style="font-size: 14px; color: rgba(255, 255, 255, 0.9); font-weight: 300;">
                ${orderDetails.paymentMethod === 'cod' ? 'Cash on Delivery' : 'UPI Payment'}
            </p>
        </div>

    </div>


    <div style="text-align: center; margin-top: 40px;">
        <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://makers3d.com'}/profile" 
           style="display: inline-block; background-color: #ffffff; color: #000000; 
                  padding: 15px 40px; text-decoration: none; font-size: 10px; 
                  letter-spacing: 0.3em; text-transform: uppercase; font-weight: 700;">
            TRACK YOUR ORDER
        </a>
    </div>
`;

// Order Shipped Email Template
export const getOrderShippedContent = (orderDetails: {
    orderId: string;
    customerName: string;
    trackingNumber?: string;
}) => `
    <div style="text-align: center; margin-bottom: 40px;">
        <div style="display: inline-block; background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); 
                    padding: 12px 25px; margin-bottom: 25px;">
            <p style="font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: #3b82f6; margin: 0;">
                📦 Order Shipped
            </p>
        </div>
        <h1 style="font-size: 42px; font-weight: 100; letter-spacing: -0.02em; margin-bottom: 15px; color: #ffffff;">
            Your Order is On Its Way
        </h1>
        <p style="font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(255, 255, 255, 0.4);">
            Order #${orderDetails.orderId}
        </p>
    </div>

    <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); padding: 35px; margin-bottom: 30px;">
        <p style="font-size: 16px; color: rgba(255, 255, 255, 0.9); margin-bottom: 20px; font-weight: 300;">
            Hello <strong style="color: #ffffff;">${orderDetails.customerName}</strong>,
        </p>
        <p style="font-size: 14px; color: rgba(255, 255, 255, 0.7); line-height: 1.8; margin-bottom: 15px;">
            Great news! Your order has been shipped and is on its way to you. 
            ${orderDetails.trackingNumber ? `You can track your package using the tracking number below.` : 'You will receive it soon.'}
        </p>
    </div>

    ${orderDetails.trackingNumber ? `
    <div style="background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%); 
                border: 1px solid rgba(59, 130, 246, 0.2); padding: 30px; margin-bottom: 30px; text-align: center;">
        <p style="font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(255, 255, 255, 0.5); margin-bottom: 15px;">
            Tracking Number
        </p>
        <p style="font-size: 24px; font-weight: 300; color: #3b82f6; letter-spacing: 0.1em; font-family: 'Courier New', monospace;">
            ${orderDetails.trackingNumber}
        </p>
    </div>
    ` : ''}

    <div style="background: rgba(255, 255, 255, 0.02); border-left: 2px solid rgba(59, 130, 246, 0.5); padding: 25px; margin-bottom: 30px;">
        <h3 style="font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(255, 255, 255, 0.5); margin-bottom: 15px;">
            Delivery Timeline
        </h3>
        <p style="font-size: 14px; color: rgba(255, 255, 255, 0.7); line-height: 1.8;">
            Your order will be delivered within 5-7 business days. We'll send you another email once it's delivered.
        </p>
    </div>

    <div style="text-align: center; margin-top: 40px;">
        <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://makers3d.com'}/profile" 
           style="display: inline-block; background-color: #ffffff; color: #000000; 
                  padding: 15px 40px; text-decoration: none; font-size: 10px; 
                  letter-spacing: 0.3em; text-transform: uppercase; font-weight: 700;">
            VIEW ORDER STATUS
        </a>
    </div>
`;

// Order Delivered Email Template
export const getOrderDeliveredContent = (orderDetails: {
    orderId: string;
    customerName: string;
}) => `
    <div style="text-align: center; margin-bottom: 40px;">
        <div style="display: inline-block; background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3); 
                    padding: 12px 25px; margin-bottom: 25px;">
            <p style="font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: #22c55e; margin: 0;">
                ✓ Delivered Successfully
            </p>
        </div>
        <h1 style="font-size: 42px; font-weight: 100; letter-spacing: -0.02em; margin-bottom: 15px; color: #ffffff;">
            Your Order Has Been Delivered
        </h1>
        <p style="font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(255, 255, 255, 0.4);">
            Order #${orderDetails.orderId}
        </p>
    </div>

    <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); padding: 35px; margin-bottom: 30px;">
        <p style="font-size: 16px; color: rgba(255, 255, 255, 0.9); margin-bottom: 20px; font-weight: 300;">
            Hello <strong style="color: #ffffff;">${orderDetails.customerName}</strong>,
        </p>
        <p style="font-size: 14px; color: rgba(255, 255, 255, 0.7); line-height: 1.8; margin-bottom: 15px;">
            Your order has been successfully delivered! We hope you're satisfied with your purchase.
        </p>
        <p style="font-size: 14px; color: rgba(255, 255, 255, 0.7); line-height: 1.8;">
            Thank you for choosing MAKERS3D. We look forward to serving you again.
        </p>
    </div>

    <div style="background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%); 
                border: 1px solid rgba(255, 255, 255, 0.05); padding: 30px; margin-bottom: 30px; text-align: center;">
        <h3 style="font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(255, 255, 255, 0.5); margin-bottom: 20px;">
            How Was Your Experience?
        </h3>
        <p style="font-size: 13px; color: rgba(255, 255, 255, 0.6); line-height: 1.8; margin-bottom: 25px;">
            Your feedback helps us improve our products and services.
        </p>
        <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://makers3d.com'}/feedback" 
           style="display: inline-block; background: rgba(255, 255, 255, 0.05); color: #ffffff; 
                  border: 1px solid rgba(255, 255, 255, 0.1); padding: 12px 30px; text-decoration: none; 
                  font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; font-weight: 700;">
            SHARE FEEDBACK
        </a>
    </div>

    <div style="text-align: center; margin-top: 40px;">
        <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://makers3d.com'}" 
           style="display: inline-block; background-color: #ffffff; color: #000000; 
                  padding: 15px 40px; text-decoration: none; font-size: 10px; 
                  letter-spacing: 0.3em; text-transform: uppercase; font-weight: 700;">
            CONTINUE SHOPPING
        </a>
    </div>
`;

// Return Confirmed Email Template
export const getReturnConfirmedContent = (returnDetails: {
    orderId: string;
    customerName: string;
    returnId: string;
    reason?: string;
}) => `
    <div style="text-align: center; margin-bottom: 40px;">
        <div style="display: inline-block; background: rgba(251, 191, 36, 0.1); border: 1px solid rgba(251, 191, 36, 0.3); 
                    padding: 12px 25px; margin-bottom: 25px;">
            <p style="font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: #fbbf24; margin: 0;">
                ↩ Return Confirmed
            </p>
        </div>
        <h1 style="font-size: 42px; font-weight: 100; letter-spacing: -0.02em; margin-bottom: 15px; color: #ffffff;">
            Return Request Approved
        </h1>
        <p style="font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(255, 255, 255, 0.4);">
            Return ID #${returnDetails.returnId}
        </p>
    </div>

    <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); padding: 35px; margin-bottom: 30px;">
        <p style="font-size: 16px; color: rgba(255, 255, 255, 0.9); margin-bottom: 20px; font-weight: 300;">
            Hello <strong style="color: #ffffff;">${returnDetails.customerName}</strong>,
        </p>
        <p style="font-size: 14px; color: rgba(255, 255, 255, 0.7); line-height: 1.8; margin-bottom: 15px;">
            Your return request for Order #${returnDetails.orderId} has been approved. 
            We'll arrange for pickup of the item(s) soon.
        </p>
    </div>

    <div style="background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%); 
                border: 1px solid rgba(255, 255, 255, 0.05); padding: 30px; margin-bottom: 30px;">
        <h3 style="font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(255, 255, 255, 0.5); margin-bottom: 20px;">
            Next Steps
        </h3>
        <ul style="list-style: none; padding: 0;">
            <li style="font-size: 13px; color: rgba(255, 255, 255, 0.7); margin-bottom: 12px; padding-left: 20px; position: relative;">
                <span style="position: absolute; left: 0; color: rgba(251, 191, 36, 0.5);">1.</span>
                Keep the item(s) ready in original packaging
            </li>
            <li style="font-size: 13px; color: rgba(255, 255, 255, 0.7); margin-bottom: 12px; padding-left: 20px; position: relative;">
                <span style="position: absolute; left: 0; color: rgba(251, 191, 36, 0.5);">2.</span>
                Our courier will contact you within 2-3 business days
            </li>
            <li style="font-size: 13px; color: rgba(255, 255, 255, 0.7); margin-bottom: 12px; padding-left: 20px; position: relative;">
                <span style="position: absolute; left: 0; color: rgba(251, 191, 36, 0.5);">3.</span>
                Refund will be processed within 5-7 business days after pickup
            </li>
        </ul>
    </div>

    ${returnDetails.reason ? `
    <div style="background: rgba(255, 255, 255, 0.02); border-left: 2px solid rgba(251, 191, 36, 0.5); padding: 25px; margin-bottom: 30px;">
        <p style="font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255, 255, 255, 0.4); margin-bottom: 10px;">
            Return Reason
        </p>
        <p style="font-size: 14px; color: rgba(255, 255, 255, 0.7); line-height: 1.8;">
            ${returnDetails.reason}
        </p>
    </div>
    ` : ''}

    <div style="text-align: center; margin-top: 40px;">
        <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://makers3d.com'}/profile" 
           style="display: inline-block; background-color: #ffffff; color: #000000; 
                  padding: 15px 40px; text-decoration: none; font-size: 10px; 
                  letter-spacing: 0.3em; text-transform: uppercase; font-weight: 700;">
            VIEW RETURN STATUS
        </a>
    </div>
`;

// Password Reset Email Template
export const getPasswordResetContent = (name: string, resetLink: string) => `
    <div style="text-align: center; margin-bottom: 40px;">
        <div style="display: inline-block; background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); 
                    padding: 12px 25px; margin-bottom: 25px;">
            <p style="font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: #3b82f6; margin: 0;">
                🔑 Password Reset
            </p>
        </div>
        <h1 style="font-size: 42px; font-weight: 100; letter-spacing: -0.02em; margin-bottom: 15px; color: #ffffff;">
            Reset Your Password
        </h1>
        <p style="font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(255, 255, 255, 0.4);">
            Secure Account Recovery
        </p>
    </div>

    <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); padding: 35px; margin-bottom: 30px;">
        <p style="font-size: 16px; color: rgba(255, 255, 255, 0.9); margin-bottom: 20px; font-weight: 300;">
            Hello <strong style="color: #ffffff;">${name}</strong>,
        </p>
        <p style="font-size: 14px; color: rgba(255, 255, 255, 0.7); line-height: 1.8; margin-bottom: 25px;">
            We received a request to reset the password for your MAKERS3D account. 
            To proceed with setting a new password, please click the button below:
        </p>
        
        <div style="text-align: center; margin: 40px 0;">
            <a href="${resetLink}" 
               style="display: inline-block; background-color: #ffffff; color: #000000; 
                      padding: 15px 40px; text-decoration: none; font-size: 10px; 
                      letter-spacing: 0.3em; text-transform: uppercase; font-weight: 700;">
                RESET PASSWORD
            </a>
        </div>
        
        <p style="font-size: 12px; color: rgba(255, 255, 255, 0.4); text-align: center; margin-top: 20px;">
            This link will expire in 1 hour.
        </p>
    </div>

    <div style="background: rgba(255, 255, 255, 0.02); padding: 25px; border: 1px solid rgba(255, 255, 255, 0.05);">
        <p style="font-size: 11px; color: rgba(255, 255, 255, 0.4); line-height: 1.6; margin-bottom: 10px;">
            If the button above doesn't work, copy and paste this link into your browser:
        </p>
        <p style="font-size: 10px; color: #3b82f6; word-break: break-all; font-family: 'Courier New', monospace;">
            ${resetLink}
        </p>
    </div>

    <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid rgba(255, 255, 255, 0.05);">
        <p style="font-size: 11px; color: rgba(255, 255, 255, 0.4); text-align: center; line-height: 1.6;">
            If you didn't request a password reset, you can safely ignore this email.<br/>
            Your password will remain unchanged.
        </p>
    </div>
`;
