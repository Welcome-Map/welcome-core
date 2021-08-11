import { createTestAccount, createTransport } from 'nodemailer';
export const createFakeMailer = async () => {
  return new Promise((resolve, reject) => {
    let transporter;
    createTestAccount((err, account) => {
      if (err) reject(err);
      transporter = createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });
      resolve(transporter);
    });
  });
};
