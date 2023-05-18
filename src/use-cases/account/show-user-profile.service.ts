import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
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
    @Inject(CACHE_MANAGER)
    private readonly cacheService: Cache,
  ) {}

  async execute(id: string): Promise<User> {
    try {
      const user = await this.usersRepository.showUserProfile(id);

      await this.cacheService.set(id, user);

      const cacheData = await this.cacheService.get(id);

      this.loggerServices.log(
        `CACHE_DATA_PROFILE`,
        `${JSON.stringify(cacheData)}`,
      );

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
