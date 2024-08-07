import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Role } from 'src/enums/role.enum';
import { District } from 'src/entities/district.entity';
import { Category } from 'src/entities/category.entity';
import { Deposite } from 'src/entities/deposite.entity';
import { SourceOfRevenue } from 'src/entities/source-of-revenue.entity';
import { DepositeBreakdown } from 'src/entities/deposite-breakdown.entity';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Deposite) private readonly depositeRepository: Repository<Deposite>,
    @InjectRepository(SourceOfRevenue) private readonly sourceOfRevenueRepository: Repository<SourceOfRevenue>,
    @InjectRepository(DepositeBreakdown) private readonly depositeBrakedownRepository: Repository<DepositeBreakdown>

  ) {

  }

  async summaryDeposite(year) {
    const query = this.depositeRepository.createQueryBuilder('d')
      .select('c.id', 'category_id')
      .addSelect('MAX(c.name)', 'category_name')
      .addSelect('MAX(sor.id)', 'source_of_revenue_id')
      .addSelect('MAX(sor.name)', 'source_of_revenue_name')
      .addSelect('MONTH(d.date)', 'month')
      .addSelect('SUM(d.amount)', 'total')
      .innerJoin(SourceOfRevenue, 'sor', 'sor.id = d.source_of_revenue_id')
      .innerJoin(Category, 'c', 'c.id = sor.category_id')
      .where('YEAR(d.date) = :year', { year })
      .groupBy('c.id')
      .addGroupBy('sor.id')
      .addGroupBy('MONTH(d.date)');

    const rawResults = await query.getRawMany();
    
    return this.transformedResults(rawResults);
  }

  async summaryBreakdown(year, depositeAreaId) {
    const query = this.depositeBrakedownRepository.createQueryBuilder('db')
      .select('c.id', 'category_id')
      .addSelect('MAX(c.name)', 'category_name')
      .addSelect('MAX(sor.id)', 'source_of_revenue_id')
      .addSelect('MAX(sor.name)', 'source_of_revenue_name')
      .addSelect('MONTH(d.date)', 'month')
      .addSelect('SUM(db.amount)', 'total')
      .innerJoin(Deposite, 'd', 'd.id = db.deposite_id')
      .innerJoin(SourceOfRevenue, 'sor', 'sor.id = d.source_of_revenue_id')
      .innerJoin(Category, 'c', 'c.id = sor.category_id')
      .where('db.deposite_area_id = :depositeAreaId', { depositeAreaId })
      .andWhere('YEAR(d.date) = :year', { year })
      .groupBy('c.id')
      .addGroupBy('sor.id')
      .addGroupBy('MONTH(d.date)');

    const rawResults = await query.getRawMany();

    return this.transformedResults(rawResults);
  }

  private transformedResults(rawResults) {
    // Transform raw results to desired format
    const transformedResults = rawResults.reduce((acc, row) => {
      const category = acc.find(cat => cat.id === row.category_id);
      if (!category) {
        acc.push({
          id: row.category_id,
          name: row.category_name,
          source_of_revenue: [{
            id: row.source_of_revenue_id,
            name: row.source_of_revenue_name,
            revenue: [{
              month: row.month,
              total: row.total
            }]
          }]
        });
      } else {
        const sourceOfRevenue = category.source_of_revenue.find(sor => sor.id === row.source_of_revenue_id);
        if (!sourceOfRevenue) {
          category.source_of_revenue.push({
            id: row.source_of_revenue_id,
            name: row.source_of_revenue_name,
            revenue: [{
              month: row.month,
              total: row.total
            }]
          });
        } else {
          sourceOfRevenue.revenue.push({
            month: row.month,
            total: row.total
          });
        }
      }
      return acc;
    }, []);

    return transformedResults;
  }
}
