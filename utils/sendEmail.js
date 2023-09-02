import nodemailer from 'nodemailer';

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.NM_HOST,
    port: process.env.NM_PORT,
    auth: {
      user: process.env.NM_USER,
      pass: process.env.NM_PASS,
    },
  });

  return transporter.sendMail({
    from: '"danzBraham" <zidan@gmail.com>',
    to,
    subject,
    html,
  });
};

export default sendEmail;
