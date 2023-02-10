/** @format */

import { IService, ServiceResult, ServiceResultType } from "@application";
import { appDevelopmentLogger } from "@common";
import { IEmailRequestDto, IEmailResponseDto } from "./dtos";
import { IEmailSender } from "./interfaces";

export class EmailService
  implements IService<IEmailRequestDto, IEmailResponseDto>
{
  private emailSender: IEmailSender;
  constructor(emailSender: IEmailSender) {
    this.emailSender = emailSender;
  }
  async execute({
    to,
    subject,
    text,
    html,
  }: IEmailRequestDto): Promise<ServiceResultType<IEmailResponseDto>> {
    try {
      const response = await this.emailSender.sendEmail({
        to, // list of receivers
        subject, // Subject line
        text, // plain text body
        html, // html body
      });
      return ServiceResult.success({
        messageId: response.messageId,
        success: true,
      });
    } catch (error: any) {
      return ServiceResult.fail(error.message);
    }
  }
}
