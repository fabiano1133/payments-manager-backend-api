import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDTO } from 'src/infrastructure/common/DTOs';
import { ExceptionsService } from 'src/infrastructure/exceptions/exceptions.service';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { IUsersRepository } from 'src/domain/repositories/users-repository.interface';
import { DatabaseUsersRepository } from 'src/infrastructure/repositories/users-repository/repositories.service';
import { IBcryptService } from 'src/domain/adapters/bcrypt.interface';
import { BcryptService } from 'src/infrastructure/services/bcrypt/bcrypt.service';

@Injectable()
export class CreateUserService {
  private loggerService: LoggerService = new LoggerService();
  private exceptionsService: ExceptionsService = new ExceptionsService();

  constructor(
    @Inject(DatabaseUsersRepository)
    private readonly usersRepository: IUsersRepository,

    @Inject(BcryptService)
    private readonly bcryptService: IBcryptService,
  ) {}

  async execute(user: CreateUserDTO): Promise<void> {
    try {
      const userAllreadyExists = await this.usersRepository.findUserByEmail(
        user.email,
      );

      if (userAllreadyExists)
        this.exceptionsService.badRequestException({
          message: `Email already exists in database`,
          code_error: 400,
        });

      const phoneAllreadyExists = await this.usersRepository.findUserByPhone(
        user.phone,
      );

      if (phoneAllreadyExists)
        this.exceptionsService.badRequestException({
          message: `Phone already exists`,
          code_error: 400,
        });

      const hashedPassword = await this.bcryptService.hashPassword(
        user.password,
      );

      await this.usersRepository.insertUser({
        ...user,
        password: hashedPassword,
      });

      this.loggerService.log(
        `${CreateUserService.name}`,
        `User created: ${user.name}`,
      );
    } catch (error) {
      this.loggerService.error(`${CreateUserService.name}`, `${error.message}`);
      this.exceptionsService.badRequestException({
        message: `A Error occurred when try to create a new user: ${error.message}`,
        code_error: 400,
      });
    }
  }
}
