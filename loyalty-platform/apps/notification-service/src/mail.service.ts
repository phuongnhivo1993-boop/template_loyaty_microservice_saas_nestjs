import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    const host = process.env.SMTP_HOST || 'localhost';
    const port = parseInt(process.env.SMTP_PORT || '1025', 10);
    const user = process.env.SMTP_USER || '';
    const pass = process.env.SMTP_PASS || '';

    if (process.env.NODE_ENV === 'production' || (host !== 'localhost' && user && pass)) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: user && pass ? { user, pass } : undefined,
      });
    } else {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        ignoreTLS: true,
      });
      this.logger.log(`MailService using dev SMTP at ${host}:${port}`);
    }
  }

  async sendEmail(options: { to: string; subject: string; html: string; text?: string }): Promise<boolean> {
    try {
      const fromName = process.env.SMTP_FROM_NAME || 'Loyalty Platform';
      const fromEmail = process.env.SMTP_FROM_EMAIL || 'noreply@loyalty-platform.com';
      await this.transporter.sendMail({
        from: `"${fromName}" <${fromEmail}>`,
        to: options.to,
        subject: options.subject,
        text: options.text || options.html.replace(/<[^>]*>/g, ''),
        html: options.html,
      });
      this.logger.log(`Email sent to ${options.to}: ${options.subject}`);
      return true;
    } catch (error: any) {
      this.logger.error(`Failed to send email to ${options.to}: ${error.message}`);
      return false;
    }
  }
}
