/** @format */

import { IService } from "@application/interfaces";
import { IUserProps } from "@domain";
import { IUserRepo, UserMapper, UserRepoInstance } from "@Infrastructure";
import {
  ServiceResult,
  ServiceResultType,
  UnExpextedDatabaseError,
  UserNotFoundError,
} from "@application/services";
import { IGetUserRequestDto, IGetUserResponseDto } from "./dtos";
import { ErrorStatusCodes } from "@http";

class GetUserService
  implements IService<IGetUserRequestDto, IGetUserResponseDto>
{
  userRepo: IUserRepo;
  constructor(userRepo: IUserRepo) {
    this.userRepo = userRepo;
  }

  async execute(
    getUserDto: IGetUserRequestDto
  ): Promise<ServiceResultType<IGetUserResponseDto>> {
    let dbUser: IUserProps;
    try {
      dbUser = await this.userRepo.getById(getUserDto.id);
    } catch (error) {
      return ServiceResult.fail(
        new UnExpextedDatabaseError(
          ErrorStatusCodes.DATABASE_ERROR,
          "Error Fetching User"
        )
      );
    }
    if (!dbUser) {
      return ServiceResult.fail(
        new UserNotFoundError(ErrorStatusCodes.NOT_FOUND, "User Not Found")
      );
    }
    const user = UserMapper.toDomainFromDb(dbUser).getValue();
    return ServiceResult.success({
      id: user.id,
      email: user.userProps.email as string,
      name: user.userProps.name as string,
    });
  }
}

export const GetUserServiceInstance = new GetUserService(UserRepoInstance);
