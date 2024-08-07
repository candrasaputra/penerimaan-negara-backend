import { Body, Controller, Delete, Get, Param, Patch, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import RoleGuard from '../guards/role.guard';
import { Role } from '../enums/role.enum';
import { AuthGuard } from '../guards/auth.guard';
import { DepositeAreaService } from 'src/services/deposite-area.service';

@Controller('api/deposite-area')
export class DepositeAreaController {
  constructor(
    private readonly depositeAreaService: DepositeAreaService,
  ) {}

  @Get('/')
  @UseGuards(RoleGuard([Role.AM_PPN, Role.SPESIALIS_KEUANGAN]))
  @UseGuards(AuthGuard)
  async getAll() {
    try {
      return this.depositeAreaService.getAll();
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Get('/:id')
  @UseGuards(RoleGuard([Role.AM_PPN, Role.SPESIALIS_KEUANGAN]))
  @UseGuards(AuthGuard)
  async getSingle(@Param('id') id: string) {
    try {
      return this.depositeAreaService.getSingle(id);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Post('/')
  @UseGuards(RoleGuard([Role.AM_PPN]))
  @UseGuards(AuthGuard)
  async create(@Body('name') name: string) {
    try {
      return this.depositeAreaService.create({ name });
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Patch('/:id')
  @UseGuards(RoleGuard([Role.AM_PPN]))
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: string,
    @Body('name') name: string
  ) {
    try {
      return this.depositeAreaService.update(id, { name });
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
      return this.depositeAreaService.delete(id);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
