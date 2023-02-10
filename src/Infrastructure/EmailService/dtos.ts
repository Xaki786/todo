/** @format */

export interface IEmailRequestDto {
  to: string;
  subject: string;
  text: string;
  html: string;
}
export interface IEmailResponseDto {
  success: boolean;
  messageId: string;
}
