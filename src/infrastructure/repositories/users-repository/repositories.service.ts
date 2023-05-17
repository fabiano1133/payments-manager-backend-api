import { Injectable } from '@nestjs/common';
import { IUsersRepository } from 'src/domain/repositories/users-repository.interface';
import User from '../../entities/users/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDTO } from 'src/infrastructure/common/DTOs';

@Injectable()
export class DatabaseUsersRepository implements IUsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly userEntityRepository: Repository<User>,
  ) {}

  async insertUser(user: CreateUserDTO): Promise<void> {
    const userEntity = this.userEntityRepository.create(user);

    await this.userEntityRepository.save(userEntity);
  }
  async findUser(id: string): Promise<User> {
    const user = await this.userEntityRepository.findOne({
      where: { id },
      relations: ['payments'],
    });

    return user;
  }
  async findAllUsers(): Promise<User[]> {
    return await this.userEntityRepository.find({
      relations: ['payments'],
    });
  }
  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userEntityRepository.findOne({
      where: { email },
    });
    return user;
  }
  async findUserByPhone(phone: string): Promise<User> {
    const phoneUser = await this.userEntityRepository.findOne({
      where: { phone },
    });
    return phoneUser;
  }
  async showUserProfile(id: string): Promise<User> {
    const user = await this.userEntityRepository.findOne({
      where: { id },
      relations: ['payments'],
    });
    return user;
  }
  async updateUserIsPro(id: string, user: User): Promise<void> {
    const newUser = await this.userEntityRepository.findOne({
      where: { id },
      relations: ['payments'],
    });
    await this.userEntityRepository.save({ ...newUser, ...user });
  }
}
