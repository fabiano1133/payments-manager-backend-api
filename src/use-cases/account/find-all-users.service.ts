import { Inject, Injectable } from '@nestjs/common';
import { IUsersRepository } from 'src/domain/repositories/users-repository.interface';
import User from 'src/infrastructure/entities/users/user.entity';
import { ExceptionsService } from 'src/infrastructure/exceptions/exceptions.service';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { DatabaseUsersRepository } from 'src/infrastructure/repositories/users-repository/repositories.service';

@Injectable()
export class FindAllUsersService {
  private loggerService: LoggerService = new LoggerService();
  private exceptionsService: ExceptionsService = new ExceptionsService();

  constructor(
    @Inject(DatabaseUsersRepository)
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute(): Promise<User[]> {
    try {
      const users = await this.usersRepository.findAllUsers();

      this.loggerService.log(
        `${FindAllUsersService.name}`,
        `Users found: ${users.length}`,
      );

      return users;
    } catch (error) {
      this.loggerService.error(
        `${FindAllUsersService.name}`,
        `${error.message}`,
      );
      this.exceptionsService.badRequestException({
        message: `A Error occurred when try to find a user: ${error.message}}`,
        code_error: 400,
      });
    }
  }
}
