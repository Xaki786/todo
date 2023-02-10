/** @format */

import { IService, ServiceResult, ServiceResultType } from "@application";
import { INotificationRequestDto, INotificationResponseDto } from "./dtos";
import { INotificationSenderToCommunicationChannel } from "./interfaces";

export class SlackNotificationService
  implements IService<INotificationRequestDto, INotificationResponseDto>
{
  private notificationSender: INotificationSenderToCommunicationChannel;
  constructor(notificationSender: INotificationSenderToCommunicationChannel) {
    this.notificationSender = notificationSender;
  }

  async execute(
    notificationDto: INotificationRequestDto
  ): Promise<ServiceResultType<INotificationResponseDto>> {
    const { userEmail } = notificationDto;
    try {
      const response = await this.notificationSender.sendNotification(
        userEmail
      );
      if (response.ok) {
        return ServiceResult.success({
          success: response.ok,
          message: response?.message?.text as string,
        });
      }
      return ServiceResult.fail(response.error);
    } catch (error) {
      return ServiceResult.fail(error as Error);
    }
  }
}
