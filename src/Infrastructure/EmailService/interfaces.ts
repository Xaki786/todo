/** @format */

export type TEmailProps = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

export interface IEmailSender {
  sendEmail: (emailProps: TEmailProps) => any;
}
