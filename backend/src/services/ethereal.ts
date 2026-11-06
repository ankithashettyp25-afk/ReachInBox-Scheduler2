import nodemailer from 'nodemailer';

let testAccount: nodemailer.TestAccount | null = null;
let transporter: nodemailer.Transporter | null = null;

export async function getEtherealTransporter() {
  if (!transporter) {
    testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log(`Ethereal SMTP initialized. User: ${testAccount.user}`);
  }
  return { transporter, account: testAccount };
}