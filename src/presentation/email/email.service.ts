import nodemailer from 'nodemailer';
import { envs } from '../../config/plugins/env.plugin';
import { LogRepository } from '../../domain/repositories/log.repository';
import { LogEntity, LogSeverityLevel } from '../../domain/entities/log.entity';

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  htmlBody: string;
  attachments?: Attachment[];
}

interface Attachment {
  filename: string;
  path: string;
}

//todo attachement

export class EmailService {

  private transporter = nodemailer.createTransport({
    service: envs.MAILER_SERVICE,
    auth: {
      user: envs.MAILER_EMAIL,
      pass: envs.MAILER_SECRET_KEY,
    },
  });

  constructor() {}

  async sendEmail(options: SendEmailOptions):Promise<boolean> {
    const {to, subject, htmlBody, attachments} = options;

    try {

      const sentInformation = await this.transporter.sendMail({
        to: to,
        subject: subject,
        html: htmlBody,
        attachments: attachments,
        
      });

      return true;
    } catch (error) {
      return false;
    }
  }

  async sendEmailWithFileSystemLogs(to: string | string[]) {
    const subject = 'Server Logs';
    const htmlBody = `
      <h3> SERVER LOGS - NOC </h3>
      <p> Daily report with all logs of our system. Regards! </p>
      <p> See attachments </p>
    `;

    const attachments: Attachment[] = [
      {filename: 'logs-all.log', path: './logs/logs-all.log'},
      {filename: 'logs-medium.log', path: './logs/logs-medium.log'},
      {filename: 'logs-high.log', path: './logs/logs-high.log'},
    ];

    return this.sendEmail({
      to, subject, attachments, htmlBody,
    });

  }

}