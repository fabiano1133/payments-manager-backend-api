import { Inject, Injectable } from '@nestjs/common';
import { IUsersRepository } from 'src/domain/repositories/users-repository.interface';
import User from 'src/infrastructure/entities/users/user.entity';
import { ExceptionsService } from 'src/infrastructure/exceptions/exceptions.service';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { DatabaseUsersRepository } from 'src/infrastructure/repositories/users-repository/repositories.service';

@Injectable()
export class FindUserService {
  private loggerService: LoggerService = new LoggerService();
  private exceptionsService: ExceptionsService = new ExceptionsService();

  constructor(
    @Inject(DatabaseUsersRepository)
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute(id: string): Promise<User> {
    try {
      const user = await this.usersRepository.findUser(id);

      if (!user)
        this.exceptionsService.badRequestException({
          message: `User not found`,
          code_error: 400,
        });

      this.loggerService.log(
        `${FindUserService.name}`,
        `User found: ${JSON.stringify(user)}`,
      );
      return user;
    } catch (error) {
      this.loggerService.error(`${FindUserService.name}`, `${error.message}`);
      this.exceptionsService.badRequestException({
        message: `A Error occurred when try to find a user: ${error.message}`,
        code_error: 400,
      });
    }
  }
}
