import { Body, Controller, Delete, Get, Param, Patch, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import RoleGuard from '../guards/role.guard';
import { Role } from '../enums/role.enum';
import { AuthGuard } from '../guards/auth.guard';
import { UserDistrictService } from 'src/services/user-district.service';

@Controller('api/user-district')
@UseGuards(RoleGuard([Role.AM_PPN]))
@UseGuards(AuthGuard)
export class UserDistrictController {
  constructor(
    private readonly userDistrictService: UserDistrictService,
  ) {}

  @Get('/')
  async getAll() {
    try {
      return this.userDistrictService.getAll();
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Get('/:id')
  async getSingle(@Param('id') id: string) {
    try {
      return this.userDistrictService.getSingle(id);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Post('/')
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
