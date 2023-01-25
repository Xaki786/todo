/** @format */

import { exclude } from "../../common";
import { User } from "../../domain";
import { IUserProps } from "../../domain/entities/interfaces";

export class UserMapper {
  public static toDomain(dbUser: IUserProps) {
    const userWithOutHash = exclude(dbUser, ["hash"] as never);
    return userWithOutHash;
  }

  public static toDb(user: User): IUserProps {
    return user.userProps;
  }
}
