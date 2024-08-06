import { Body, Controller, Delete, Get, Param, Patch, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UserService } from '../services/user.service';
import RoleGuard from '../guards/role.guard';
import { Role } from '../enums/role.enum';
import { AuthGuard } from '../guards/auth.guard';

@Controller('api/user')
@UseGuards(RoleGuard([Role.AM_PPN]))
@UseGuards(AuthGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Get('/')
  async getAll() {
    try {
      return this.userService.getAll();
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Get('/:id')
  async getSingle(@Param('id') id: string) {
    try {
      console.log(id);
      return this.userService.getSingle(id);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Post('/')
  async create(
    @Body('name') name: string,
    @Body('username') username: string,
    @Body('password') password: string
  ) {
    try {
      return this.userService.create({ name, username, password });
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Body('name') name?: string,
    @Body('username') username?: string,
    @Body('password') password?: string
  ) {
    try {
      return this.userService.update(id, { name, username, password });
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Delete('/:id')
  async delete(
    @Param('id') id: string
  ) {
    try {
      return this.userService.delete(id);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
