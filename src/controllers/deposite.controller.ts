import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import RoleGuard from '../guards/role.guard';
import { Role } from '../enums/role.enum';
import { AuthGuard } from '../guards/auth.guard';
import { DepositeService } from 'src/services/deposite.service';
``
@Controller('api/deposite')
@UseGuards(RoleGuard([Role.AM_PPN, Role.SPESIALIS_KEUANGAN]))
@UseGuards(AuthGuard)
export class DepositeController {
  constructor(
    private readonly depositeService: DepositeService,
  ) {}

  @Get('/')
  async getAll() {
    try {
      return this.depositeService.getAll();
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Get('/:id')
  async getSingle(@Param('id') id: string) {
    try {
      return this.depositeService.getSingle(id);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Post('/')
  async create(
    @Body('district') district: string,
    @Body('source_of_revenue') source_of_revenue: string,
    @Body('amount') amount: string,
    @Body('date') date: string,
    @Req() request: any
  ) {
    try {
      const user = await request.user;

      return this.depositeService.create(user, { district, source_of_revenue, amount, date });
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Body('district') district: string,
    @Body('source_of_revenue') source_of_revenue: string,
    @Body('amount') amount: string,
    @Body('date') date: string,
    @Req() request: any
  ) {
    try {
      const user = await request.user;

      return this.depositeService.update(id, user, { district, source_of_revenue, amount, date });
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Delete('/:id')
  async delete(
    @Param('id') id: string
  ) {
    try {
      return this.depositeService.delete(id);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
