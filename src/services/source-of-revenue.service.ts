import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { SourceOfRevenue } from 'src/entities/source-of-revenue.entity';

@Injectable()
export class SourceOfRevenueService {
  constructor(
    @InjectRepository(SourceOfRevenue) private readonly sourceOfRevenueRepository: Repository<SourceOfRevenue>
  ) {

  }

  async getAll() {
    const data = await this.sourceOfRevenueRepository.find();

    return data;
  }

  async getSingle(id: string) {
    const data = await this.sourceOfRevenueRepository.findOne({
      where: {
        id
      }
    });

    if(!data) {
      throw new NotFoundException('data not found');
    }
  
    return data;
  }

  async create(data: any): Promise<SourceOfRevenue> {
    return this.sourceOfRevenueRepository.save({
      id: randomUUID(),
      name: data.name,
      category: data.category,
      parent: data?.parent
    });
  }

  async update(id: string, data: any): Promise<any> {
    await this.sourceOfRevenueRepository.update({
        id
      },{
        name: data.name,
        category: data?.category,
        parent: data?.parent
    });

    return {
      message: 'update success!',
          data: [{
              id
          }]
    }
  }

  async delete(id: string): Promise<any> {
    await this.sourceOfRevenueRepository.delete({ id });

    return {
      message: 'delete success!',
          data: [{
              id
          }]
    }
  }
}
