import { Body, Controller, Delete, Get, Param, Patch, Post, UnauthorizedException, UseGuards, Req } from '@nestjs/common';
import RoleGuard from '../guards/role.guard';
import { Role } from '../enums/role.enum';
import { AuthGuard } from '../guards/auth.guard';
import { DistrictService } from 'src/services/district.service';

@Controller('api/district')
export class DistrictController {
  constructor(
    private readonly districtService: DistrictService,
  ) {}

  @Get('/')
  @UseGuards(RoleGuard([Role.AM_PPN, Role.SPESIALIS_KEUANGAN]))
  @UseGuards(AuthGuard)
  async getAll(
    @Req() request: any
  ) {
    try {
      const user = await request.user;

      return this.districtService.getAll(user);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
