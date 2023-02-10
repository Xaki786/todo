/** @format */

import { DomainEventsQueue, ISubscribeEvent, UserCreatedEvent } from "@domain";
import {
  EmailService,
  EmailSender,
  IEmailRequestDto,
} from "@Infrastructure/EmailService";
import { logger } from "@Infrastructure/LoggingService";
import {
  SlackNotificationService,
  SlackSender,
} from "@Infrastructure/SlackNotificationService";

export class ObserverOnUserCreated implements ISubscribeEvent {
  constructor() {
    this.setupSubscriptions();
  }
  setupSubscriptions() {
    DomainEventsQueue.subscribeEvent({
      callback: this.onUserCreated,
      eventClassName: UserCreatedEvent.name,
    });
  }
  private onUserCreated = async (event: UserCreatedEvent) => {
    await this.sendWelcomeEmailToUser(event);
    await this.sendSlackNotification(event);
  };

  private sendWelcomeEmailToUser = async (event: UserCreatedEvent) => {
    const { user } = event;
    const emailRequestDto: IEmailRequestDto = {
      to: user.userProps.email,
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
      logger.log("error", `Email Error: ${result.error}`);
    }
  };

  private sendSlackNotification = async (event: UserCreatedEvent) => {
    const { user } = event;
    const slackService = new SlackNotificationService(new SlackSender());
    const result = await slackService.execute({
      userEmail: user.userProps.email,
    });
    if (result.success) {
      logger.log(
        "info",
        `Notification message sent successfully message: ${result.value.message}`
      );
    } else {
      logger.log("error", `Notification Error: ${result.error}`);
    }
  };
}
