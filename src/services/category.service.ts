import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { Category } from 'src/entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>
  ) {

  }

  async getAll() {
    const data = await this.categoryRepository.find();

    return data;
  }

  async getSingle(id: string) {
    const data = await this.categoryRepository.findOne({
      where: {
        id
      }
    });

    if(!data) {
      throw new NotFoundException('data not found');
    }

    return data;
  }

  async create(data: any): Promise<Category> {
    return this.categoryRepository.save({
      id: randomUUID(),
      name: data.name
    });
  }

  async update(id: string, data: any): Promise<any> {
    await this.categoryRepository.update({
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
    await this.categoryRepository.delete({ id });

    return {
      message: 'delete success!',
          data: [{
              id
          }]
    }
  }
}
