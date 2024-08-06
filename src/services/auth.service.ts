import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtServ: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {

  }

  async login(username: string, password: string) {
    if (username.length < 10) {
      throw new BadRequestException('username minimum 10 digits');
    }

    if (isNaN(Number(username.length))) {
      throw new BadRequestException('username shouldbe number');
    }
  
    const user = await this.userRepository.findOne({
      where: {
        username
      }
    });

    if (!user) {
        throw new BadRequestException('invalid credentials');
    }

    if (!await bcrypt.compare(password, user.password)) {
        throw new BadRequestException('invalid credentials');
    }

    const jwt = await this.jwtServ.signAsync({id: user.id});

    return {
      token: jwt,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role
      }
    };
  }

  async validateToken(cookie: any): Promise<any> {
    let data;
  
    try {
      data = await this.jwtServ.verifyAsync(cookie);

      const user = await this.userRepository.findOne({
        where: {id: data['id']},
        relations: ['districts', 'districts.district']
      });

      delete user.password;

      return user;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Token has expired');
      }
      throw new UnauthorizedException('Invalid token');
    }
  }
}
