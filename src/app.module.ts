import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import {JwtModule} from "@nestjs/jwt";
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { ConfigModule } from '@nestjs/config';
import { Province } from './entities/province.entity';
import { District } from './entities/district.entity';
import { Category } from './entities/category.entity';
import { DepositeArea } from './entities/deposit-area.entity';
import { SourceOfRevenue } from './entities/source-of-revenue.entity';
import { Deposite } from './entities/deposite.entity';
import { DepositeBreakdown } from './entities/deposite-breakdown.entity';
import { AllocationPercentage } from './entities/allocation-percentage.entity';
import { UserDistrict } from './entities/user-district.entity';
import { CategoryController } from './controllers/category.controller';
import { CategoryService } from './services/category.service';
import { SeedService } from './services/seed.service';
import { SeedController } from './controllers/seed.controller';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { DepositeAreaController } from './controllers/deposite-area.controller';
import { DepositeAreaService } from './services/deposite-area.service';
import { SourceOfRevenueController } from './controllers/source-of-revenue.controller';
import { SourceOfRevenueService } from './services/source-of-revenue.service';
import { UserDistrictController } from './controllers/user-district.controller';
import { UserDistrictService } from './services/user-district.service';
import { DepositeService } from './services/deposite.service';
import { DepositeController } from './controllers/deposite.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: process.env.DBHOST,
      port: 1433,
      username: process.env.DBUSERNAME,
      password: process.env.DBPASSWORD,
      database: process.env.DBNAME,
      entities: [User, Province, District, Category, DepositeArea, SourceOfRevenue, Deposite, DepositeBreakdown, AllocationPercentage, UserDistrict],
      synchronize: true,
      options: {
        encrypt: true,
        trustServerCertificate: true,
      }
    }),
    TypeOrmModule.forFeature([User, Province, District, Category, DepositeArea, SourceOfRevenue, Deposite, DepositeBreakdown, AllocationPercentage, UserDistrict]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: {expiresIn: '1h'}
    }),
  ],
  controllers: [AuthController, CategoryController, UserController, DepositeAreaController, SeedController, SourceOfRevenueController, UserDistrictController, DepositeController],
  providers: [AuthService, CategoryService, UserService, DepositeAreaService, SeedService, SourceOfRevenueService, UserDistrictService, DepositeService],
})
export class AppModule {}
