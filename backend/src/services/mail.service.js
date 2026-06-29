const { BrevoClient } = require("@getbrevo/brevo");

const sendEmail = async ({ to, subject, text, html }) => {
  const client = new BrevoClient({ apiKey: process.env.BREVO_API_KEY_SMTP });

  await client.transactionalEmails.sendTransacEmail({
    sender: { name: "Plataforma PAVE", email: "paveufc@gmail.com" },
    to: [{ email: to }],
    subject,
    textContent: text,
    htmlContent: html,
  });
};

module.exports = { sendEmail };
