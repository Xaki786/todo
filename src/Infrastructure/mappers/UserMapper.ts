/** @format */

import { ICreateUserRequestDto } from "@application";
import { exclude } from "@common";
import { User, IUserProps } from "@domain";

export class UserMapper {
  public static toDomainFromDto(createUserDto: ICreateUserRequestDto) {
    return User.create(createUserDto);
  }
  public static toDomainFromDb(dbUser: IUserProps) {
    return User.create(dbUser);
  }

  public static toService(userProps: IUserProps) {
    const userWithOutHash = exclude(userProps, ["hash"] as never);
    return userWithOutHash;
  }

  public static toDbFromDomain(user: User): IUserProps {
    return user.userProps;
  }
}
