import { User } from "../../domain";
import { IUserProps } from "../../domain/entities/interfaces";

export class UserMapper {
  public static toDomain(dbUser: IUserProps): User {
    return User.create(dbUser);
  }
}
