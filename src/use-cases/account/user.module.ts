import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/infrastructure/entities/users/user.entity';
import { UserController } from 'src/infrastructure/controllers/user.controller';
import { CreateUserService } from 'src/use-cases/account/create-account.service';
import { DatabaseUsersRepository } from '../../infrastructure/repositories/users-repository/repositories.service';
import { FindUserService } from './find-user.service';
import { FindAllUsersService } from './find-all-users.service';
import { BcryptService } from '../../infrastructure/services/bcrypt/bcrypt.service';
import { JwtModule } from 'src/infrastructure/services/jwt/jwt.module';
import { ShowUserProfileService } from './show-user-profile.service';
import { UpdateUserIsProService } from './update-user-ispro.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule],
  controllers: [UserController],
  providers: [
    CreateUserService,
    DatabaseUsersRepository,
    FindUserService,
    FindAllUsersService,
    BcryptService,
    ShowUserProfileService,
    UpdateUserIsProService,

    // {
    //   provide: 'IUsersRepository',
    //   useClass: DatabaseUsersRepository,
    // },
  ],
  exports: [TypeOrmModule],
})
export class UserModule {}
