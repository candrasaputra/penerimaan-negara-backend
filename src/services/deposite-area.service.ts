import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { DepositeArea } from 'src/entities/deposit-area.entity';

@Injectable()
export class DepositeAreaService {
  constructor(
    @InjectRepository(DepositeArea) private readonly depositeAreaRepository: Repository<DepositeArea>
  ) {

  }

  async getAll() {
    const data = await this.depositeAreaRepository.find();

    return data;
  }

  async getSingle(id: string) {
    const data = await this.depositeAreaRepository.findOne({
      where: {
        id
      }
    });

    if(!data) {
      throw new NotFoundException('data not found');
    }
  
    return data;
  }

  async create(data: any): Promise<DepositeArea> {
    return this.depositeAreaRepository.save({
      id: randomUUID(),
      name: data.name
    });
  }

  async update(id: string, data: any): Promise<any> {
    await this.depositeAreaRepository.update({
      id
      },{
      name: data.name
    });

    return {
      message: 'update success!',
          data: [{
              id
          }]
    }
  }

  async delete(id: string): Promise<any> {
    await this.depositeAreaRepository.delete({ id });

    return {
      message: 'delete success!',
          data: [{
              id
          }]
    }
  }
}
