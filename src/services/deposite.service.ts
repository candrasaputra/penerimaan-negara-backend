import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async getAll() {
    const data = await this.depositeRepository.find();

    return data;
  }

  async getSingle(id: string) {
    const data = await this.depositeRepository.findOne({
      where: {
        id
      }
    });

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

  async update(id: string, activeUser: any, data: any): Promise<any> {
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

    await this.depositeRepository.update({
      id
      },{
        district: data.district,
        source_of_revenue: data.source_of_revenue,
        amount: data.amount,
        date: data.date
    });

    return {
      message: 'update success!',
          data: [{
              id
          }]
    }
  }

  async delete(id: string): Promise<any> {
    await this.depositeRepository.delete({ id });

    return {
      message: 'delete success!',
          data: [{
              id
          }]
    }
  }
}
