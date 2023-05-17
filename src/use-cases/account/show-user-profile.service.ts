import { Inject, Injectable } from '@nestjs/common';
import { IUsersRepository } from 'src/domain/repositories/users-repository.interface';
import User from 'src/infrastructure/entities/users/user.entity';
import { ExceptionsService } from 'src/infrastructure/exceptions/exceptions.service';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { DatabaseUsersRepository } from 'src/infrastructure/repositories/users-repository/repositories.service';

@Injectable()
export class ShowUserProfileService {
  private loggerServices: LoggerService = new LoggerService(
    ShowUserProfileService.name,
  );
  private exceptionsService: ExceptionsService = new ExceptionsService();

  constructor(
    @Inject(DatabaseUsersRepository)
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute(id: string): Promise<User> {
    try {
      const user = await this.usersRepository.showUserProfile(id);

      this.loggerServices.log(`User profile`, `${JSON.stringify(user)}`);

      return user;
    } catch (error) {
      this.loggerServices.error(error.message, error);
      this.exceptionsService.badRequestException({
        message: `${error.message}`,
        code_error: 400,
      });
    }
  }
}
