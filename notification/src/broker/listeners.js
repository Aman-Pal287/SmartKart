const { subscribeToQueue } = require("./broker");
const { sendEmail } = require("../email");

module.exports = function () {
  subscribeToQueue("AUTH_NOTIFICATION.USER_CREATED", async (data) => {
    const emailHTMLTemplate = `
      <h1>Welcome to our Service!</h1>
      <p>Dear ${data.fullName.firstName} ${data.fullName.lastName},</p>
      <p>Thank you for registering with us .We're excited to have you on board!</p>
      <p>Best regards, </br> The Team</p>
    `;

    await sendEmail(
      data.email,
      "Welcome to Our Service",
      "Thank you for registering with us!",
      emailHTMLTemplate
    );
  });

  subscribeToQueue("PAYMENT_NOTIFICATION.PAYMENT_COMPLETED", async (data) => {
    const emailHTMLTemplate = `
      <h1>Payment Successful!</h1>
      <p>Dear ${data.username},</p>
      <p>Your payment of ${data.currency} ${data.amount} has been successfully processed.</p>
      <p>Order ID: ${data.orderId}</p>
      <p>Payment ID: ${data.paymentId}</p>
      <p>Thank you for your purchase!</p>
      <p>Best regards, </br> The Team</p>
    `;

    await sendEmail(
      data.email,
      "Payment Confirmation",
      "Your payment was successful!",
      emailHTMLTemplate
    );
  });

  subscribeToQueue("PAYMENT_NOTIFICATION.PAYMENT_FAILED", async (data) => {
    const emailHTMLTemplate = `
      <h1>Payment Failed</h1>
      <p>Dear ${data.username},</p>
      <p>We regret to inform you that your recent payment attempt of ${data.currency} ${data.amount} was unsuccessful.</p>
      <p>Order ID: ${data.orderId}</p>
      <p>Payment ID: ${data.paymentId}</p>
      <p>Please try again or contact support if the issue persists.</p>
      <p>Best regards, </br> The Team</p>
    `;
    await sendEmail(
      data.email,
      "Payment Failed",
      "Your payment was unsuccessful.",
      emailHTMLTemplate
    );
  });
};
