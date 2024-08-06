import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { User } from 'src/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {

  }

  async getAll() {
    const user = await this.userRepository.find();

    return user;
  }

  async getSingle(id: string) {
    const user = await this.userRepository.findOne({
      where: {
        id
      }
    });

    return user;
  }

  async create(data: any): Promise<User> {
    if (data.username.length < 10) {
      throw new BadRequestException('username minimum 10 digits');
    }

    if (isNaN(Number(data.username.length))) {
      throw new BadRequestException('username shouldbe number');
    }

    const hasedPassword = await bcrypt.hash(data.password, 12);

    return this.userRepository.save({
      id: randomUUID(),
      name: data.name,
      username: data.username,
      password: hasedPassword
    });
  }

  async update(id: string, data: any): Promise<any> {
    if (data.username.length < 10) {
      throw new BadRequestException('username minimum 10 digits');
    }

    if (isNaN(Number(data.username.length))) {
      throw new BadRequestException('username shouldbe number');
    }
  
    const payload: any = {
      name: data.name,
      username: data.username,
    };

    if (data.password) {
      const hasedPassword = await bcrypt.hash(data.password, 12);

      payload.password = hasedPassword
    }


    await this.userRepository.update({
      id
      },payload);

    return {
      message: 'update success!',
          data: [{
              id
          }]
    }
  }

  async delete(id: string): Promise<any> {
    await this.userRepository.delete({ id });

    return {
      message: 'delete success!',
          data: [{
              id
          }]
    }
  }
}
