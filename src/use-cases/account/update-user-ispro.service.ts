import { Inject, Injectable } from '@nestjs/common';
import { IUsersRepository } from 'src/domain/repositories/users-repository.interface';
import { ExceptionsService } from 'src/infrastructure/exceptions/exceptions.service';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { DatabaseUsersRepository } from 'src/infrastructure/repositories/users-repository/repositories.service';

@Injectable()
export class UpdateUserIsProService {
  private loggerService: LoggerService = new LoggerService(
    UpdateUserIsProService.name,
  );

  private exceptionsService: ExceptionsService = new ExceptionsService();
  constructor(
    @Inject(DatabaseUsersRepository)
    private readonly usersRespository: IUsersRepository,
  ) {}

  async execute(id: string): Promise<void> {
    try {
      const userFound = await this.usersRespository.findUser(id);

      if (userFound.isPro === true)
        this.exceptionsService.badRequestException({
          message: 'User is already a Pro',
        });

      userFound.isPro = true;

      await this.usersRespository.updateUserIsPro(id, userFound);

      this.loggerService.log(
        UpdateUserIsProService.name,
        `User ${userFound.name} is now a Pro`,
      );
    } catch (error) {
      this.loggerService.error(
        UpdateUserIsProService.name,
        `Error updating user to Pro: ${error.message}`,
      );
      this.exceptionsService.badRequestException({
        message: error.message,
        code_error: error,
      });
    }
  }
}
