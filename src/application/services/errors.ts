/** @format */

import { BaseError } from "@http/middlewares";

export class InvalidUserDataError extends BaseError {}
export class UserAlreadyExistError extends BaseError {}
export class UnExpextedDatabaseError extends BaseError {}
export class JWTGenerateError extends BaseError {}
export class UserNotFoundError extends BaseError {}
export class InvalidTaskData extends BaseError {}
export class TaskNotFoundError extends BaseError {}
export class PasswordDecryptionError extends BaseError {}
export class InvalidCredentialsError extends BaseError {}