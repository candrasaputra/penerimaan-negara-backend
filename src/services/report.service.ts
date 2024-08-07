import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Role } from 'src/enums/role.enum';
import { District } from 'src/entities/district.entity';
import { Category } from 'src/entities/category.entity';
import { Deposite } from 'src/entities/deposite.entity';
import { SourceOfRevenue } from 'src/entities/source-of-revenue.entity';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Deposite) private readonly depositeRepository: Repository<Deposite>,
    @InjectRepository(SourceOfRevenue) private readonly sourceOfRevenueRepository: Repository<SourceOfRevenue>
  ) {

  }

  async summaryDeposite(year) {
    const categories: any = await this.categoryRepository.find();

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

    const rawResult = await query.getRawMany();
    
    // Transform the raw results
    const transformedResults = rawResult.reduce((acc, row) => {
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
