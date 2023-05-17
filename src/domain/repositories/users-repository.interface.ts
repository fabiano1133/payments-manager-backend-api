import User from 'src/infrastructure/entities/users/user.entity';

export interface IUsersRepository {
  insertUser(user: User): Promise<void>;
  findUser(id: string): Promise<User>;
  findAllUsers(): Promise<User[]>;
  findUserByEmail(email: string): Promise<User>;
  findUserByPhone(phone: string): Promise<User>;
  showUserProfile(id: string): Promise<User>;
  updateUserIsPro(id: string, user: User): Promise<void>;
}
