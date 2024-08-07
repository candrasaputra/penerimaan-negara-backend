import { Body, Controller, Delete, Get, Param, Patch, Post, UnauthorizedException, UseGuards, Query } from '@nestjs/common';
import RoleGuard from '../guards/role.guard';
import { Role } from '../enums/role.enum';
import { AuthGuard } from '../guards/auth.guard';
import { ReportService } from 'src/services/report.service';

@Controller('api/report')
export class ReportController {
  constructor(
    private readonly reportService: ReportService,
  ) {}

  @Get('/summary-deposite')
  @UseGuards(RoleGuard([Role.AM_PPN, Role.SPESIALIS_KEUANGAN]))
  @UseGuards(AuthGuard)
  async summaryDeposite(
    @Query('year') year: number
  ) {
    try {
      return this.reportService.summaryDeposite(year);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Get('/summary-breakdown')
  @UseGuards(RoleGuard([Role.AM_PPN, Role.SPESIALIS_KEUANGAN]))
  @UseGuards(AuthGuard)
  async summaryBrakedown(
    @Query('year') year: number,
    @Query('deposite_area') deposite_area: string
  ) {
    try {
      return this.reportService.summaryBreakdown(year, deposite_area);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
