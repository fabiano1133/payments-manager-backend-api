import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../../use-cases/auth/auth.service';
import { SigninDTO } from 'src/infrastructure/common/DTOs/signin.dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async handleSignin(@Body() signinDto: SigninDTO): Promise<any> {
    return await this.authService.signin({
      email: signinDto.email,
      password: signinDto.password,
    });
  }
}
