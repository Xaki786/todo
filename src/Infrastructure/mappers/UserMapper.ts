/** @format */

import { exclude } from "../../common";
import { Result } from "../../common/ErrorHandling";
import { User } from "../../domain";
import { IUserProps } from "../../domain/entities/interfaces";

export class UserMapper {
  public static toDomain(dbUser: IUserProps) {
    const userOrError: Result<User> = User.create(dbUser);
    const user = userOrError.getValue();
    return user;
  }

  public static toService(dbUser: IUserProps){
    const userWithOutHash = exclude(dbUser, ["hash"] as never);
    return userWithOutHash;
  }

  public static toDb(user: User): IUserProps {
    return user.userProps;
  }
}
