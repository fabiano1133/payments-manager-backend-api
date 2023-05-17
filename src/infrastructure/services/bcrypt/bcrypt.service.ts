import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IBcryptService } from 'src/domain/adapters/bcrypt.interface';

@Injectable()
export class BcryptService implements IBcryptService {
  roundSalt = 10;

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.roundSalt);
  }
  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
