import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Role } from 'src/enums/role.enum';
import { District } from 'src/entities/district.entity';

@Injectable()
export class DistrictService {
  constructor(
    @InjectRepository(District) private readonly districtRepository: Repository<District>
  ) {

  }

  async getAll(activeUser) {
    let filter: any = {
      relations: ['users', 'users.user']
    }

    if (activeUser.role === Role.SPESIALIS_KEUANGAN) {
      const userId = activeUser.id; 

      filter.where = {
        users: { 'user.id': userId },
      }
    }

    const data: any = await this.districtRepository.find(filter);
    return data;
  }
}
