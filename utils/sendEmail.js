// backend/utils/sendEmail.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// simple HTML order email builder
const buildOrderHtml = (order) => {
  const itemsHtml = order.items.map(i => `
    <tr>
      <td style="padding:6px 8px">${i.name} (${i.size || '-'})</td>
      <td style="padding:6px 8px; text-align:center">${i.qty}</td>
      <td style="padding:6px 8px; text-align:right">₹${(i.price).toFixed(2)}</td>
    </tr>`).join('');

  return `
    <div style="font-family:Arial, sans-serif; color:#111;">
      <h2>Thank you for your order!</h2>
      <p>Order ID: <strong>${order._id}</strong></p>
      <p>Date: ${new Date(order.orderDate).toLocaleString()}</p>
      <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
        <thead>
          <tr style="background:#f4f4f4;">
            <th style="text-align:left; padding:6px 8px">Item</th>
            <th style="text-align:center; padding:6px 8px">Qty</th>
            <th style="text-align:right; padding:6px 8px">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
      <h3 style="text-align:right; margin-top:12px">Total: ₹${order.totalPrice.toFixed(2)}</h3>
      <p>Shipping to: ${order.shippingAddress?.fullName || ''}, ${order.shippingAddress?.addressLine1 || ''}</p>
      <p style="margin-top:20px">If you have any questions contact support.</p>
    </div>
  `;
};

const sendOrderEmail = async (toEmail, order) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject: `Order Confirmation - ${order._id}`,
      html: buildOrderHtml(order)
    });
    return info;
  } catch (err) {
    console.error('Error sending email', err);
    throw err;
  }
};

module.exports = { sendOrderEmail };
