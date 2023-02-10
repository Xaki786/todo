/** @format */

import { IEmailSender, TEmailProps } from "./interfaces";
import nodemailer from "nodemailer";
import { appDevelopmentLogger } from "@common";

export class EmailSender implements IEmailSender {
  private transporter?: nodemailer.Transporter;
  private senderRecipient: any;
  constructor() {}

  private async init() {
    this.senderRecipient = await nodemailer.createTestAccount();
    this.transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.senderRecipient.user, // generated ethereal user
        pass: this.senderRecipient.pass, // generated ethereal password
      },
    });
  }
  async sendEmail({ text, to, subject, html }: TEmailProps) {
    await this.init();
    const result = await this.transporter?.sendMail({
      from: `Carbonteq 👻 ${this.senderRecipient.user}`,
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });
    return { messageId: result.messageId };
  }
}
