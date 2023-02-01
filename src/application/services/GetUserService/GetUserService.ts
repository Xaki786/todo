/** @format */

import { IService } from "@application/interfaces";
import { IUserProps } from "@domain";
import { IUserRepo, UserMapper, UserRepoInstance } from "@Infrastructure";
import { UnExpextedDatabaseError, UserNotFoundError } from "../errors";
import { ServiceResult, ServiceResultType } from "../ServiceResult";
import { IGetUserRequestDto, IGetUserResponseDto } from "./dtos";

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
        new UnExpextedDatabaseError("Error Fetching User")
      );
    }
    if (!dbUser) {
      return ServiceResult.fail(new UserNotFoundError("User Not Found"));
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