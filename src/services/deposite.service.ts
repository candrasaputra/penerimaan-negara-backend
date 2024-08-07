import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { randomUUID } from 'crypto';
import { Deposite } from 'src/entities/deposite.entity';
import { DepositeBreakdown } from 'src/entities/deposite-breakdown.entity';
import { AllocationPercentage } from 'src/entities/allocation-percentage.entity';
import { Role } from 'src/enums/role.enum';
import { UserDistrict } from 'src/entities/user-district.entity';

@Injectable()
export class DepositeService {
  constructor(
    @InjectRepository(Deposite) private readonly depositeRepository: Repository<Deposite>,
    @InjectRepository(DepositeBreakdown) private readonly depositeBrakedownRepository: Repository<DepositeBreakdown>,
    @InjectRepository(AllocationPercentage) private readonly allocationPercentageRepository: Repository<AllocationPercentage>,
    @InjectRepository(UserDistrict) private readonly userDistrictRepository: Repository<UserDistrict>,
  ) {

  }

  async depositeMonthly(year: number) {
    const result = await this.depositeRepository.createQueryBuilder('d')
    .select('DATEPART(MONTH, d.date)', 'month')
    .addSelect('SUM(d.amount)', 'total')
    .where('YEAR(d.date) = :year', { year })
    .groupBy('DATEPART(MONTH, d.date)')
    .getRawMany();

    return result;
  }

  async getAll(activeUser: any) {
    let filter: any = {
      relations: ['district', 'source_of_revenue']
    }

    if (activeUser.role === Role.SPESIALIS_KEUANGAN) {
      const districtIds = activeUser.districts.map((item: any) => item.district.id); 

      filter.where = {
        district: { id: In(districtIds) },
      }
    }

    const data = await this.depositeRepository.find(filter);

    return data;
  }

  async getSingle(activeUser: any, id: string) {
    let filter: any = {
      where: {
        id
      },
      relations: ['district', 'source_of_revenue', 'breakdown', 'breakdown.deposite_area']
    }

    if (activeUser.role === Role.SPESIALIS_KEUANGAN) {
      const districtIds = activeUser.districts.map((item: any) => item.district.id); 

      filter.where.district = { id: In(districtIds) };
    }
  
    const data = await this.depositeRepository.findOne(filter);

    if(!data) {
      throw new NotFoundException('data not found');
    }

    return data;
  }

  async create(activeUser: any, data: any): Promise<Deposite> {
    if (activeUser.role === Role.SPESIALIS_KEUANGAN) {
      const userDistrict = await this.userDistrictRepository.findOne({
        where: {
          district: { id: data.district },
          user: { id: activeUser.id }
        }
      });

      if (!userDistrict) {
        throw new UnauthorizedException('No access');
      }
    }

    const [deposite, allocationPercentage] = await Promise.all([
      this.depositeRepository.save({
        id: randomUUID(),
        district: data.district,
        source_of_revenue: data.source_of_revenue,
        amount: data.amount,
        date: data.date
      }),
      this.allocationPercentageRepository.find({
        where: {
          source_of_revenue: { id: data.source_of_revenue } 
        },
        relations: ['deposite_area', 'source_of_revenue']
      })
    ]);

    const depositeBrakedownPromise = []
    for (let i = 0; i < allocationPercentage.length; i++) {
      const el: any = allocationPercentage[i];
      depositeBrakedownPromise.push(this.depositeBrakedownRepository.save({
        id: randomUUID(),
        deposite: deposite.id,
        deposite_area: el.deposite_area.id,
        amount: data.amount * (el.percentage/100)
      }));
    }

    await Promise.all(depositeBrakedownPromise);

    return deposite;
  }

  async update(activeUser: any, id: string, data: any): Promise<any> {
    if (activeUser.role === Role.SPESIALIS_KEUANGAN) {
      const userDistrict = await this.userDistrictRepository.findOne({
        where: {
          district: { id: data.district },
          user: { id: activeUser.id }
        }
      });

      if (!userDistrict) {
        throw new UnauthorizedException('No access');
      }
    }

    const [deposite, allocationPercentage] = await Promise.all([
      this.depositeRepository.update(id, {
        district: data.district,
        source_of_revenue: data.source_of_revenue,
        amount: data.amount,
        date: data.date
      }),
      this.allocationPercentageRepository.find({
        where: {
          source_of_revenue: { id: data.source_of_revenue } 
        },
        relations: ['deposite_area', 'source_of_revenue']
      })
    ]);

    await this.depositeBrakedownRepository.delete({
        deposite: { id }
    });

    const depositeBrakedownPromise = []
    for (let i = 0; i < allocationPercentage.length; i++) {
      const el: any = allocationPercentage[i];
      depositeBrakedownPromise.push(this.depositeBrakedownRepository.save({
        id: randomUUID(),
        deposite: id,
        deposite_area: el.deposite_area.id,
        amount: data.amount * (el.percentage/100)
      }));
    }

    await Promise.all(depositeBrakedownPromise);

    return deposite;
  }

  async delete(activeUser: any, id: string): Promise<any> {
    let filter: any = {
      id
    }

    if (activeUser.role === Role.SPESIALIS_KEUANGAN) {
      const districtIds = activeUser.districts.map((item: any) => item.district.id); 

      filter.district = { id: In(districtIds) };
    }

    await this.depositeRepository.delete(filter);

    return {
      message: 'delete success!',
          data: [{
              id
          }]
    }
  }
}
