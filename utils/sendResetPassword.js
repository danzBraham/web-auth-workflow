import sendEmail from './sendEmail.js';

const sendResetPasswordEmail = async ({ name, email, token, origin }) => {
  const resetPasswordUrl = `${origin}/user/reset-password?token=${token}&email=${email}`;
  const message = `Please reset password by clicking on the following link: 
                    <a href="${resetPasswordUrl}">Reset Password</a>`;

  return sendEmail({
    to: email,
    subject: 'Reset Password',
    html: `<h1>Hello ${name}</h1>
            <p>${message}</p>`,
  });
};

export default sendResetPasswordEmail;
