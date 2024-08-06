import { Body, Controller, Delete, Get, Param, Patch, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import { CategoryService } from '../services/category.service';
import RoleGuard from '../guards/role.guard';
import { Role } from '../enums/role.enum';
import { AuthGuard } from '../guards/auth.guard';

@Controller('api/category')
@UseGuards(RoleGuard([Role.AM_PPN]))
@UseGuards(AuthGuard)
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
  ) {}

  @Get('/')
  async getAll() {
    try {
      return this.categoryService.getAll();
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Get('/:id')
  async getSingle(@Param('id') id: string) {
    try {
      return this.categoryService.getSingle(id);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Post('/')
  async create(@Body('name') name: string) {
    try {
      return this.categoryService.create({ name });
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Body('name') name: string
  ) {
    try {
      return this.categoryService.update(id, { name });
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Delete('/:id')
  async delete(
    @Param('id') id: string
  ) {
    try {
      return this.categoryService.delete(id);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
