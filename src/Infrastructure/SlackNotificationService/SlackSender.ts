/** @format */

import { WebClient, LogLevel } from "@slack/web-api";
import { envConfigObject } from "@config";
import { INotificationSenderToCommunicationChannel } from "@Infrastructure/SlackNotificationService/interfaces";

export class SlackSender implements INotificationSenderToCommunicationChannel {
  private client: WebClient;
  private channelId: string;
  constructor() {
    this.client = new WebClient(envConfigObject.SLACK_TOKEN, {
      // LogLevel can be imported and used to make debugging simpler
      logLevel: LogLevel.INFO,
    });
    this.channelId = envConfigObject.SLACK_CHANNEL_ID as string;
  }
  async sendNotification(userEmail: string) {
    try {
      let welComeMessage = `We warmly welcome you to our product. Thanks for joining us ${userEmail}`;
      const result = await this.client.chat.postMessage({
        channel: this.channelId,
        text: welComeMessage,
      });
      return result;
    } catch (error: any) {
      return error?.data;
    }
  }
}
