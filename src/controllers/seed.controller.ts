import { Controller, Post, Req, UnauthorizedException } from '@nestjs/common';
import { SeedService } from '../services/seed.service';

@Controller('api/temporary-endpoint/seed')
export class SeedController {
  constructor(
    private readonly seedService: SeedService,
  ) {}

  @Post('/')
  async seed(@Req() request: any) {
    try {
      return this.seedService.seed();
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
