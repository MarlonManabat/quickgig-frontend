// types/nodemailer.d.ts
declare module "nodemailer" {
  // minimal surface we use
  export interface Transporter {
    sendMail(options: {
      from: string;
      to: string;
      subject: string;
      html: string;
    }): Promise<unknown>;
  }
  export default function createTransport(opts: {
    host: string;
    port: number;
    secure: boolean;
    auth: { user: string; pass: string };
  }): Transporter;
}
