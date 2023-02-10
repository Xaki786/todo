/** @format */

import { DomainEventsQueue, ISubscribeEvent, UserCreatedEvent } from "@domain";
import {
  EmailService,
  EmailSender,
  IEmailRequestDto,
} from "@Infrastructure/EmailService";
import { logger } from "@Infrastructure/LoggingService";

export class NotificationsAfterUserCreated implements ISubscribeEvent {
  constructor() {
    this.setupSubscriptions();
  }
  setupSubscriptions() {
    DomainEventsQueue.subscribeEvent({
      callback: this.onUserCreated,
      eventClassName: UserCreatedEvent.name,
    });
  }
  onUserCreated = async (event: UserCreatedEvent) => {
    const { user } = event;
    const emailRequestDto: IEmailRequestDto = {
      to: "",
      subject: "On Boarding Email",
      text: "Welcome to the team",
      html: "<b>Welcome to the team</b>",
    };
    const emailService = new EmailService(new EmailSender());
    const result = await emailService.execute(emailRequestDto);
    if (result.success) {
      logger.log(
        "info",
        `Email sent successfully messageId: ${result.value.messageId}`
      );
    } else {
      logger.log("error", result.error);
    }
  };
}
