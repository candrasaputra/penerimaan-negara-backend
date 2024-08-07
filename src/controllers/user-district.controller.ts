import { Body, Controller, Delete, Get, Param, Patch, Post, UnauthorizedException, UseGuards, Req } from '@nestjs/common';
import RoleGuard from '../guards/role.guard';
import { Role } from '../enums/role.enum';
import { AuthGuard } from '../guards/auth.guard';
import { UserDistrictService } from 'src/services/user-district.service';

@Controller('api/user-district')
export class UserDistrictController {
  constructor(
    private readonly userDistrictService: UserDistrictService,
  ) {}

  @Get('/')
  @UseGuards(RoleGuard([Role.AM_PPN, Role.SPESIALIS_KEUANGAN]))
  @UseGuards(AuthGuard)
  async getAll(
    @Req() request: any
  ) {
    try {
      const user = await request.user;

      return this.userDistrictService.getAll(user);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Get('/:id')
  @UseGuards(RoleGuard([Role.AM_PPN, Role.SPESIALIS_KEUANGAN]))
  @UseGuards(AuthGuard)
  async getSingle(@Param('id') id: string) {
    try {
      return this.userDistrictService.getSingle(id);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Post('/')
  @UseGuards(RoleGuard([Role.AM_PPN]))
  @UseGuards(AuthGuard)
  async create(
    @Body('name') name: string,
    @Body('user') user: string,
    @Body('district') district: string,
  ) {
    try {
      return this.userDistrictService.create({ name, user, district });
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Patch('/:id')
  @UseGuards(RoleGuard([Role.AM_PPN]))
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: string,
    @Body('user') user: string,
    @Body('district') district: string
  ) {
    try {
      return this.userDistrictService.update(id, { user, district });
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Delete('/:id')
  @UseGuards(RoleGuard([Role.AM_PPN]))
  @UseGuards(AuthGuard)
  async delete(
    @Param('id') id: string
  ) {
    try {
      return this.userDistrictService.delete(id);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
