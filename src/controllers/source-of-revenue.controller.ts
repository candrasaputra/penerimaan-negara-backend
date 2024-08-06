import { Body, Controller, Delete, Get, Param, Patch, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import RoleGuard from '../guards/role.guard';
import { Role } from '../enums/role.enum';
import { AuthGuard } from '../guards/auth.guard';
import { SourceOfRevenueService } from 'src/services/source-of-revenue.service';

@Controller('api/source-of-revenue')
@UseGuards(RoleGuard([Role.AM_PPN]))
@UseGuards(AuthGuard)
export class SourceOfRevenueController {
  constructor(
    private readonly sourceOfRevenueService: SourceOfRevenueService,
  ) {}

  @Get('/')
  async getAll() {
    try {
      return this.sourceOfRevenueService.getAll();
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Get('/:id')
  async getSingle(@Param('id') id: string) {
    try {
      return this.sourceOfRevenueService.getSingle(id);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Post('/')
  async create(
    @Body('name') name: string,
    @Body('category') category: string,
    @Body('parent') parent?: string,
  ) {
    try {
      return this.sourceOfRevenueService.create({ name, category, parent });
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Body('name') name?: string,
    @Body('category') category?: string,
    @Body('parent') parent?: string,
  ) {
    try {
      return this.sourceOfRevenueService.update(id, { name, category, parent });
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Delete('/:id')
  async delete(
    @Param('id') id: string
  ) {
    try {
      return this.sourceOfRevenueService.delete(id);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
