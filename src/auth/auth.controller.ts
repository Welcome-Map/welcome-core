import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { RegisterDTO } from './dto/register.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { UpdatepasswordDto } from './dto/updatepassword.dto';
import { LostpasswordDTO } from './dto/lostpassword.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/signup')
  async signup(@Body() registerDTO: RegisterDTO) {
    return await this.authService.register(registerDTO);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    return await this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/verify/:code')
  async verify(@Param() params) {
    await this.authService.verify(params.code);
    return { verified: 'ok' };
  }

  @Post('/lostpassword')
  async resetPassword(@Body() resetpasswordDTO: LostpasswordDTO) {
    return await this.authService.generateResetPasswordCode(
      resetpasswordDTO.email,
    );
  }

  @Post('/password')
  async changePassword(@Body() changepasswordDTO: UpdatepasswordDto) {
    await this.authService.updatePassword(changepasswordDTO);
  }
}
