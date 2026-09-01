/**
 * Email Templates Module for SURANGHI NAAR
 * Visual Palette: #f7f3ee (bg), #39322f (primary dark text/buttons), #d4a373 (gold accent)
 */

const getEmailHeader = (title = 'SURANGHI NAAR') => `
  <div style="background-color: #39322f; padding: 24px; text-align: center; border-top-left-radius: 16px; border-top-right-radius: 16px;">
    <h1 style="color: #f7f3ee; font-family: 'Cinzel', 'Georgia', serif; font-size: 24px; font-weight: 700; letter-spacing: 3px; margin: 0; text-transform: uppercase;">
      SURANGHI NAAR
    </h1>
    <p style="color: #d4a373; font-family: 'Inter', sans-serif; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; margin: 4px 0 0 0;">
      Luxury Women's Couture
    </p>
  </div>
`;

const getEmailFooter = () => `
  <div style="background-color: #f8f4ee; padding: 20px; text-align: center; border-bottom-left-radius: 16px; border-bottom-right-radius: 16px; border-t: 1px solid #e8e2d9; margin-top: 30px;">
    <p style="color: #39322f; font-family: 'Georgia', serif; font-size: 12px; font-weight: 600; margin: 0 0 6px 0;">
      SURANGHI NAAR Customer Care
    </p>
    <p style="color: #786e68; font-family: 'Inter', sans-serif; font-size: 11px; margin: 0 0 10px 0;">
      Phone / WhatsApp: +91 9116655814 | Email: surangi.naar@gmail.com
    </p>
    <p style="color: #b58349; font-family: 'Inter', sans-serif; font-size: 10px; margin: 0;">
      © ${new Date().getFullYear()} SURANGHI NAAR. All rights reserved.
    </p>
  </div>
`;

/**
 * Password Reset Email Template
 */
export const getForgotPasswordEmailTemplate = ({ resetUrl, userName }) => {
  const nameDisplay = userName ? userName : 'Valued Customer';
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password - SURANGHI NAAR</title>
      </head>
      <body style="background-color: #f2ece4; font-family: 'Inter', Arial, sans-serif; margin: 0; padding: 30px 10px;">
        <div style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 10px 25px rgba(57, 50, 47, 0.08); overflow: hidden; border: 1px solid #e8e2d9;">
          ${getEmailHeader()}
          
          <div style="padding: 32px 28px; background-color: #ffffff;">
            <h2 style="color: #2d2624; font-family: 'Georgia', serif; font-size: 20px; margin-top: 0; margin-bottom: 12px; text-align: center;">
              Reset Password Request
            </h2>
            
            <p style="color: #39322f; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
              Hello ${nameDisplay},
            </p>
            
            <p style="color: #594f4a; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
              We received a request to reset the password for your SURANGHI NAAR account. Click the button below to set up a new password:
            </p>
            
            <div style="text-align: center; margin: 32px 0;">
              <a href="${resetUrl}" target="_blank" style="background-color: #39322f; color: #f7f3ee; font-family: 'Inter', Arial, sans-serif; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; text-decoration: none; padding: 14px 28px; border-radius: 10px; display: inline-block; box-shadow: 0 4px 12px rgba(57, 50, 47, 0.2);">
                Reset My Password
              </a>
            </div>
            
            <p style="color: #8c827a; font-size: 12px; line-height: 1.5; background-color: #f8f4ee; border: 1px solid #e8e2d9; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px;">
              <strong>Note:</strong> This password reset link will expire in <strong>30 minutes</strong>. If you did not request a password reset, you can safely ignore this email.
            </p>
            
            <p style="color: #8c827a; font-size: 11px; word-break: break-all; margin-top: 20px;">
              Or copy and paste this URL into your browser:<br>
              <a href="${resetUrl}" style="color: #b58349;">${resetUrl}</a>
            </p>
          </div>
          
          ${getEmailFooter()}
        </div>
      </body>
    </html>
  `;

  const text = `Hello ${nameDisplay},\n\nWe received a request to reset your SURANGHI NAAR password. Click the link below to set a new password:\n\n${resetUrl}\n\nThis link will expire in 30 minutes. If you did not request this, please ignore this email.`;

  return { html, text };
};

/**
 * Google Account Password Reset Notice Email Template
 */
export const getGoogleAccountForgotPasswordEmailTemplate = ({ userName }) => {
  const nameDisplay = userName ? userName : 'Valued Customer';
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Google Sign-In Account Notice - SURANGHI NAAR</title>
      </head>
      <body style="background-color: #f2ece4; font-family: 'Inter', Arial, sans-serif; margin: 0; padding: 30px 10px;">
        <div style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 10px 25px rgba(57, 50, 47, 0.08); overflow: hidden; border: 1px solid #e8e2d9;">
          ${getEmailHeader()}
          
          <div style="padding: 32px 28px; background-color: #ffffff;">
            <h2 style="color: #2d2624; font-family: 'Georgia', serif; font-size: 20px; margin-top: 0; margin-bottom: 12px; text-align: center;">
              Account Sign-In Notice
            </h2>
            
            <p style="color: #39322f; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
              Hello ${nameDisplay},
            </p>
            
            <p style="color: #594f4a; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
              This email is linked to a Google account with Suranghi Naar. There's no password to reset — just use <strong>'Continue with Google'</strong> to sign in.
            </p>
          </div>
          
          ${getEmailFooter()}
        </div>
      </body>
    </html>
  `;

  const text = `Hello ${nameDisplay},\n\nThis email is linked to a Google account with Suranghi Naar. There's no password to reset — just use 'Continue with Google' to sign in.`;

  return { html, text };
};

/**
 * Order Confirmation Email Template
 */
export const getOrderConfirmationEmailTemplate = ({ order }) => {
  const items = Array.isArray(order.items) ? order.items : [];
  
  const itemsTableRows = items.map(item => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #e8e2d9;">
        <strong style="color: #2d2624; font-size: 13px; display: block;">${item.name || 'Kurti'}</strong>
        <span style="color: #786e68; font-size: 11px;">Size: ${item.size || 'Free Size'} | Color: ${item.color || 'Standard'} | Qty: ${item.quantity || 1}</span>
      </td>
      <td style="padding: 12px 0; border-bottom: 1px solid #e8e2d9; text-align: right; font-weight: 600; color: #b58349; font-size: 13px; vertical-align: top;">
        ₹${((item.price || 0) * (item.quantity || 1)).toLocaleString()}
      </td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation - SURANGHI NAAR</title>
      </head>
      <body style="background-color: #f2ece4; font-family: 'Inter', Arial, sans-serif; margin: 0; padding: 30px 10px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 10px 25px rgba(57, 50, 47, 0.08); overflow: hidden; border: 1px solid #e8e2d9;">
          ${getEmailHeader()}
          
          <div style="padding: 32px 28px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 24px;">
              <span style="background-color: #f8f4ee; color: #b58349; border: 1px solid #e8e2d9; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; padding: 6px 14px; border-radius: 20px; display: inline-block;">
                Order Placed Successfully
              </span>
              <h2 style="color: #2d2624; font-family: 'Georgia', serif; font-size: 22px; margin: 12px 0 4px 0;">
                Thank You For Your Order!
              </h2>
              <p style="color: #786e68; font-size: 13px; margin: 0;">
                Order ID: <strong style="color: #b58349; font-family: monospace;">${order.id}</strong>
              </p>
            </div>

            <p style="color: #39322f; font-size: 14px; line-height: 1.6;">
              Dear <strong>${order.customerName || 'Customer'}</strong>,
            </p>
            <p style="color: #594f4a; font-size: 13px; line-height: 1.6; margin-bottom: 24px;">
              We have received your order and our artisan team is preparing it with standard quality control. Here are your order details:
            </p>

            <!-- Items Table -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <thead>
                <tr style="border-bottom: 2px solid #39322f;">
                  <th style="text-align: left; padding-bottom: 8px; color: #39322f; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Item Description</th>
                  <th style="text-align: right; padding-bottom: 8px; color: #39322f; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsTableRows}
              </tbody>
            </table>

            <!-- Order Summary -->
            <div style="background-color: #f8f4ee; border: 1px solid #e8e2d9; border-radius: 12px; padding: 18px; margin-bottom: 24px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #594f4a; font-size: 13px;">Payment Method:</span>
                <strong style="color: #39322f; font-size: 13px;">${order.paymentMethod || 'Prepaid'}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; border-top: 1px dashed #d4a373; padding-top: 10px; margin-top: 10px;">
                <span style="color: #2d2624; font-size: 15px; font-weight: 700; font-family: 'Georgia', serif;">Grand Total:</span>
                <strong style="color: #b58349; font-size: 16px; font-weight: 700;">₹${Number(order.total || 0).toLocaleString()}</strong>
              </div>
            </div>

            <!-- Shipping Details -->
            <div style="border: 1px solid #e8e2d9; border-radius: 12px; padding: 18px; margin-bottom: 20px;">
              <h3 style="color: #2d2624; font-family: 'Georgia', serif; font-size: 14px; margin-top: 0; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">
                Shipping Address
              </h3>
              <p style="color: #594f4a; font-size: 12px; line-height: 1.5; margin: 0;">
                ${order.customerName}<br>
                ${order.customerAddress}<br>
                Phone: ${order.customerPhone}
              </p>
            </div>
          </div>
          
          ${getEmailFooter()}
        </div>
      </body>
    </html>
  `;

  const text = `Order Confirmation - SURANGHI NAAR\n\nOrder ID: ${order.id}\nCustomer: ${order.customerName}\nTotal: ₹${order.total}\nPayment Method: ${order.paymentMethod}\nShipping Address: ${order.customerAddress}\n\nThank you for shopping with SURANGHI NAAR!`;

  return { html, text };
};

/**
 * Order Shipped Email Template
 */
export const getOrderShippedEmailTemplate = ({ order }) => {
  const items = Array.isArray(order.items) ? order.items : [];

  const itemsTableRows = items.map(item => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #e8e2d9;">
        <strong style="color: #2d2624; font-size: 13px; display: block;">${item.name || 'Kurti'}</strong>
        <span style="color: #786e68; font-size: 11px;">Size: ${item.size || 'Free Size'} | Color: ${item.color || 'Standard'} | Qty: ${item.quantity || 1}</span>
      </td>
      <td style="padding: 12px 0; border-bottom: 1px solid #e8e2d9; text-align: right; font-weight: 600; color: #b58349; font-size: 13px; vertical-align: top;">
        ₹${((item.price || 0) * (item.quantity || 1)).toLocaleString()}
      </td>
    </tr>
  `).join('');

  const trackingNumber = order.trackingNumber ? String(order.trackingNumber).trim() : '';
  const carrier = order.carrier ? String(order.carrier).trim() : '';

  let trackingBlock = '';
  if (trackingNumber || carrier) {
    trackingBlock = `
      <div style="background-color: #f8f4ee; border: 1px solid #e8e2d9; border-radius: 12px; padding: 18px; margin-bottom: 24px;">
        <h3 style="color: #2d2624; font-family: 'Georgia', serif; font-size: 14px; margin-top: 0; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px;">
          Delivery Reference & Tracking Details
        </h3>
        ${carrier ? `<p style="color: #594f4a; font-size: 13px; margin: 0 0 6px 0;">Carrier / Delivery Team: <strong style="color: #39322f;">${carrier}</strong></p>` : ''}
        ${trackingNumber ? `<p style="color: #594f4a; font-size: 13px; margin: 0 0 6px 0;">Tracking Reference #: <strong style="color: #b58349; font-family: monospace;">${trackingNumber}</strong></p>` : ''}
        <p style="color: #8c827a; font-size: 11px; margin: 8px 0 0 0; line-height: 1.5; font-style: italic;">
          * Note: This is a self-delivery order handled directly by our internal delivery team. Tracking details above serve as internal reference for your order.
        </p>
      </div>
    `;
  } else {
    trackingBlock = `
      <div style="background-color: #f8f4ee; border: 1px solid #e8e2d9; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
        <p style="color: #594f4a; font-size: 12px; margin: 0; line-height: 1.5; font-style: italic;">
          * Note: This is a self-delivery order handled directly by our internal delivery team.
        </p>
      </div>
    `;
  }

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Order Has Been Shipped - SURANGHI NAAR</title>
      </head>
      <body style="background-color: #f2ece4; font-family: 'Inter', Arial, sans-serif; margin: 0; padding: 30px 10px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 10px 25px rgba(57, 50, 47, 0.08); overflow: hidden; border: 1px solid #e8e2d9;">
          ${getEmailHeader()}
          
          <div style="padding: 32px 28px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 24px;">
              <span style="background-color: #f8f4ee; color: #b58349; border: 1px solid #e8e2d9; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; padding: 6px 14px; border-radius: 20px; display: inline-block;">
                Order Dispatched
              </span>
              <h2 style="color: #2d2624; font-family: 'Georgia', serif; font-size: 22px; margin: 12px 0 4px 0;">
                Your Order Is On Its Way!
              </h2>
              <p style="color: #786e68; font-size: 13px; margin: 0;">
                Order ID: <strong style="color: #b58349; font-family: monospace;">${order.id}</strong>
              </p>
            </div>

            <p style="color: #39322f; font-size: 14px; line-height: 1.6;">
              Dear <strong>${order.customerName || 'Customer'}</strong>,
            </p>
            <p style="color: #594f4a; font-size: 13px; line-height: 1.6; margin-bottom: 24px;">
              Great news! Your handcrafted couture order has been carefully packaged and dispatched.
            </p>

            ${trackingBlock}

            <div style="border: 1px solid #e8e2d9; border-radius: 12px; padding: 18px; margin-bottom: 24px; background-color: #ffffff;">
              <h3 style="color: #2d2624; font-family: 'Georgia', serif; font-size: 13px; margin-top: 0; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 1px;">
                Expected Delivery Timeframe
              </h3>
              <p style="color: #594f4a; font-size: 13px; margin: 0; line-height: 1.5;">
                Complimentary express delivery across India within <strong>3–7 business days</strong>.
              </p>
            </div>

            <!-- Items Table -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <thead>
                <tr style="border-bottom: 2px solid #39322f;">
                  <th style="text-align: left; padding-bottom: 8px; color: #39322f; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Item Description</th>
                  <th style="text-align: right; padding-bottom: 8px; color: #39322f; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsTableRows}
              </tbody>
            </table>

            <!-- Shipping Address -->
            <div style="border: 1px solid #e8e2d9; border-radius: 12px; padding: 18px; margin-bottom: 20px;">
              <h3 style="color: #2d2624; font-family: 'Georgia', serif; font-size: 14px; margin-top: 0; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">
                Shipping Address
              </h3>
              <p style="color: #594f4a; font-size: 12px; line-height: 1.5; margin: 0;">
                ${order.customerName}<br>
                ${order.customerAddress}<br>
                Phone: ${order.customerPhone}
              </p>
            </div>
          </div>
          
          ${getEmailFooter()}
        </div>
      </body>
    </html>
  `;

  const text = `Order Dispatched - SURANGHI NAAR\n\nOrder ID: ${order.id}\nCustomer: ${order.customerName}\nStatus: Shipped\n${carrier ? `Carrier: ${carrier}\n` : ''}${trackingNumber ? `Tracking Reference #: ${trackingNumber}\n` : ''}Expected Delivery: Complimentary express delivery across India within 3–7 business days.\n\nShipping Address: ${order.customerAddress}\n\nThank you for shopping with SURANGHI NAAR!`;

  return { html, text };
};

/**
 * Order Delivered Email Template
 */
export const getOrderDeliveredEmailTemplate = ({ order }) => {
  const items = Array.isArray(order.items) ? order.items : [];
  const baseUrl = (process.env.FRONTEND_URL || 'https://suranghinaar.com').replace(/\/$/, '');

  const itemsTableRows = items.map(item => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #e8e2d9;">
        <strong style="color: #2d2624; font-size: 13px; display: block;">${item.name || 'Kurti'}</strong>
        <span style="color: #786e68; font-size: 11px;">Size: ${item.size || 'Free Size'} | Color: ${item.color || 'Standard'} | Qty: ${item.quantity || 1}</span>
      </td>
      <td style="padding: 12px 0; border-bottom: 1px solid #e8e2d9; text-align: right; vertical-align: middle;">
        <a href="${baseUrl}/product/${item.id || item.productId}" target="_blank" style="background-color: #39322f; color: #f7f3ee; font-family: 'Inter', Arial, sans-serif; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; text-decoration: none; padding: 6px 12px; border-radius: 6px; display: inline-block;">
          Leave Review
        </a>
      </td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Order Has Been Delivered - SURANGHI NAAR</title>
      </head>
      <body style="background-color: #f2ece4; font-family: 'Inter', Arial, sans-serif; margin: 0; padding: 30px 10px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 10px 25px rgba(57, 50, 47, 0.08); overflow: hidden; border: 1px solid #e8e2d9;">
          ${getEmailHeader()}
          
          <div style="padding: 32px 28px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 24px;">
              <span style="background-color: #f8f4ee; color: #b58349; border: 1px solid #e8e2d9; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; padding: 6px 14px; border-radius: 20px; display: inline-block;">
                Delivered
              </span>
              <h2 style="color: #2d2624; font-family: 'Georgia', serif; font-size: 22px; margin: 12px 0 4px 0;">
                Your Order Has Arrived!
              </h2>
              <p style="color: #786e68; font-size: 13px; margin: 0;">
                Order ID: <strong style="color: #b58349; font-family: monospace;">${order.id}</strong>
              </p>
            </div>

            <p style="color: #39322f; font-size: 14px; line-height: 1.6;">
              Dear <strong>${order.customerName || 'Customer'}</strong>,
            </p>
            <p style="color: #594f4a; font-size: 13px; line-height: 1.6; margin-bottom: 24px;">
              Your SURANGHI NAAR order has been delivered! We hope you love your new handcrafted ensemble. Thank you for choosing SURANGHI NAAR and supporting authentic Indian artisan craftsmanship.
            </p>

            <div style="background-color: #f8f4ee; border: 1px solid #e8e2d9; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
              <h3 style="color: #2d2624; font-family: 'Georgia', serif; font-size: 16px; margin-top: 0; margin-bottom: 6px;">
                Share Your Experience
              </h3>
              <p style="color: #594f4a; font-size: 12px; line-height: 1.5; margin: 0 0 14px 0;">
                Your feedback helps us continuously refine our artisanal collections. Please take a moment to leave a review for the item(s) in your order!
              </p>
            </div>

            <!-- Items Table with Review Buttons -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <thead>
                <tr style="border-bottom: 2px solid #39322f;">
                  <th style="text-align: left; padding-bottom: 8px; color: #39322f; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Item Description</th>
                  <th style="text-align: right; padding-bottom: 8px; color: #39322f; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Review</th>
                </tr>
              </thead>
              <tbody>
                ${itemsTableRows}
              </tbody>
            </table>
          </div>
          
          ${getEmailFooter()}
        </div>
      </body>
    </html>
  `;

  const text = `Order Delivered - SURANGHI NAAR\n\nOrder ID: ${order.id}\nCustomer: ${order.customerName}\nStatus: Delivered\n\nThank you for choosing SURANGHI NAAR!\n\nLeave a review for your items:\n${items.map(item => `- ${item.name}: ${baseUrl}/product/${item.id || item.productId}`).join('\n')}`;

  return { html, text };
};

