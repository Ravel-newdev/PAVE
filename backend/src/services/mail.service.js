/**
 * @file mail.service.js
 * @description Adaptador de infraestrutura para mensageria transacional.
 * Centraliza a instância do provedor SMTP, isolando o acoplamento de rede
 * e credenciais da camada de domínio da aplicação.
 */

const nodemailer = require("nodemailer");

const port = parseInt(process.env.SMTP_PORT, 10);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: port,
  secure: port === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async ({ to, subject, text, html }) => {
  await transporter.sendMail({
    from: `"Plataforma PAVE" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text,
    html,
  });
};

module.exports = { sendEmail };