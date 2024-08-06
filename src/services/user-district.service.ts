import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { UserDistrict } from 'src/entities/user-district.entity';

@Injectable()
export class UserDistrictService {
  constructor(
    @InjectRepository(UserDistrict) private readonly userDistrictRepository: Repository<UserDistrict>
  ) {

  }

  async getAll() {
    const data = await this.userDistrictRepository.find();

    return data;
  }

  async getSingle(id: string) {
    const data = await this.userDistrictRepository.findOne({
      where: {
        id
      }
    });

    if(!data) {
      throw new NotFoundException('data not found');
    }
  
    return data;
  }

  async create(data: any): Promise<UserDistrict> {
    return this.userDistrictRepository.save({
      id: randomUUID(),
      user: data.user,
      district: data.district
    });
  }

  async update(id: string, data: any): Promise<any> {
    await this.userDistrictRepository.update({
        id
      },{
        user: data.user,
        district: data.district
    });

    return {
      message: 'update success!',
          data: [{
              id
          }]
    }
  }

  async delete(id: string): Promise<any> {
    await this.userDistrictRepository.delete({ id });

    return {
      message: 'delete success!',
          data: [{
              id
          }]
    }
  }
}
