import { BadRequestException, Body, Controller, Get, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import * as bcrypt from 'bcrypt';
import {Response, Request} from 'express';
import RoleGuard from '../guards/role.guard';
import { Role } from '../enums/role.enum';
import { AuthGuard } from '../guards/auth.guard';

@Controller('api')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  async login(
      @Body('username') username: string,
      @Body('password') password: string,
      @Res({passthrough: true}) response: Response
  ) {

        const jwt = await this.authService.login(username, password);

        response.cookie('jwt', jwt, {httpOnly: true}); 

        return {
            message: 'success'
        };
  }

  @Get('status')
  @UseGuards(RoleGuard([Role.AM_PPN, Role.SPESIALIS_KEUANGAN]))
  @UseGuards(AuthGuard)
  async user(@Req() request: any) {
    try {
      return request.user;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Post('logout')
  async logout(@Res({passthrough: true}) response: Response) {
      response.clearCookie('jwt');

      return {
          message: 'success'
      }
  }
}
