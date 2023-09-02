import sendEmail from './sendEmail.js';

const sendVerificationEmail = async ({ name, email, verificationToken, origin }) => {
  const verifyEmailLink = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`;
  const message = `Please confirm your email by clicking on the following link: <a href="${verifyEmailLink}">Verify Email</a>`;

  sendEmail({
    to: email,
    subject: 'Email Confirmation',
    html: `<h3>Hello ${name}</h3>
          <p>${message}</p>`,
  });
};

export default sendVerificationEmail;
