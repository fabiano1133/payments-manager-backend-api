import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserService } from '../../use-cases/account/create-account.service';
import { CreateUserDTO } from 'src/infrastructure/common/DTOs';
import { LoggerService } from '../logger/logger.service';
import { FindUserService } from 'src/use-cases/account/find-user.service';
import User from '../entities/users/user.entity';
import { FindAllUsersService } from 'src/use-cases/account/find-all-users.service';
import { ExceptionsService } from '../exceptions/exceptions.service';
import { AuthGuard } from '../common/guards/auth/auth.guard';
import { ShowUserProfileService } from 'src/use-cases/account/show-user-profile.service';
import { Request } from 'express';
import { UpdateUserIsProService } from 'src/use-cases/account/update-user-ispro.service';

@Controller('api/v1/users')
export class UserController {
  private loggerService: LoggerService = new LoggerService();
  private exceptionsService: ExceptionsService = new ExceptionsService();

  constructor(
    private readonly createUserService: CreateUserService,
    private readonly findUserService: FindUserService,
    private readonly findAllUsersServices: FindAllUsersService,
    private readonly showUserProfileService: ShowUserProfileService,
    private readonly updateUserIsProService: UpdateUserIsProService,
  ) {}

  @Post('create-user')
  async handleCreateUser(@Body() data: CreateUserDTO): Promise<void> {
    try {
      await this.createUserService.execute(data);
    } catch (error) {
      this.loggerService.error(`${UserController.name}`, `${error.message}`);
      this.exceptionsService.badRequestException({
        message: `${error.message}`,
        code_error: 400,
      });
    }
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('get-user/:id')
  async handleFindUser(@Param('id') id: string): Promise<User> {
    try {
      return await this.findUserService.execute(id);
    } catch (error) {
      this.loggerService.error(`${UserController.name}`, `${error.message}`);
      this.exceptionsService.badRequestException({
        message: `${error.message}`,
        code_error: 400,
      });
    }
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('get-all-users')
  async handleFindAllUsers(): Promise<User[]> {
    try {
      return await this.findAllUsersServices.execute();
    } catch (error) {
      this.loggerService.error(`${UserController.name}`, `${error.message}`);
      this.exceptionsService.badRequestException({
        message: `${error.message}`,
        code_error: 400,
      });
    }
  }

  @UseGuards(AuthGuard)
  @Get('show-user-profile')
  @UseInterceptors(ClassSerializerInterceptor)
  async showUserProfile(@Req() req: Request): Promise<User> {
    try {
      const id = req['user'].sub;
      const user = await this.showUserProfileService.execute(id);

      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  @UseGuards(AuthGuard)
  @Patch('update-user-ispro')
  async updateUserIsPro(@Req() req: Request): Promise<void> {
    try {
      const id = req['user'].sub;
      await this.updateUserIsProService.execute(id);
    } catch (error) {
      this.loggerService.error(`${UserController.name}`, `${error.message}`);
      this.exceptionsService.badRequestException({
        message: `${error.message}`,
        code_error: 400,
      });
    }
  }
}
