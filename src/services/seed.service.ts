import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../enums/role.enum';
import { randomUUID } from 'crypto';
import { Category } from 'src/entities/category.entity';
import * as bcrypt from 'bcrypt';
import { DepositeArea } from 'src/entities/deposit-area.entity';
import { SourceOfRevenue } from 'src/entities/source-of-revenue.entity';
import { Province } from 'src/entities/province.entity';
import { District } from 'src/entities/district.entity';
import { AllocationPercentage } from 'src/entities/allocation-percentage.entity';
import { UserDistrict } from 'src/entities/user-district.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
    @InjectRepository(DepositeArea) private readonly depositeAreaRepository: Repository<DepositeArea>,
    @InjectRepository(SourceOfRevenue) private readonly sourceOfRevenueRepository: Repository<SourceOfRevenue>,
    @InjectRepository(Province) private readonly provinceRepository: Repository<Province>,
    @InjectRepository(District) private readonly districtRepository: Repository<District>,
    @InjectRepository(AllocationPercentage) private readonly allocationPercentageRepository: Repository<AllocationPercentage>,
    @InjectRepository(UserDistrict) private readonly userDistrictRepository: Repository<UserDistrict>,
  ) {}

  async seed() {
    await this.seedUsers();
    await this.seedCategories();
    await this.seedDepositeArea();
    await this.seedSourceOfRevenue();
    await this.seedProvinces();
    await this.seedDistrict();
    await this.seedAllocationPercentage();
    await this.seedUserDistrict();
  }

  private async seedUsers() {
    // Delete all
    await this.userRepository.delete({});

    // Seed
    const data = [
      { id: randomUUID(), username: '1234567890', password: '1234567890', name: 'User AM_PPN', role: Role.AM_PPN },
      { id: '85FBD7D6-5E48-4CFE-B4FA-AA7C6371CFD5', username: '0987654321', password: '0987654321', name: 'User Sepesialis Keuangan', role: Role.SPESIALIS_KEUANGAN },
    ];

    for (const el of data) {
      const hasedPassword = await bcrypt.hash(el.password, 12);

      await this.userRepository.save({...el, password: hasedPassword});
    }

    console.log('Users seeded');
  }

  private async seedCategories() {
    // Delete all
    await this.categoryRepository.delete({});

    // Seed
    const data = [
      { id: '63AB3CC9-5E48-42D8-AF4A-DC1B76AAD3C3', name: 'Penerimaan Pajak' },
      { id: '79D06137-AC7E-46E9-A89F-AA7C6371CFD5', name: 'Penerimaan Pajak Daerah' },
      { id: '85FBD7D6-CD06-46BF-A9AA-0BC2832ED872', name: 'Penerimaan Bukan Pajak' },
    ];

    for (const el of data) {
      await this.categoryRepository.save(el);
    }

    console.log('categories seeded');
  }

  private async seedDepositeArea() {
    // Seed
    const data = [
      { id: '2F2C79AA-EED1-4C2A-A9D8-0E34E98E2844', name: 'Kabupaten/Kota' },
      { id: '1D62FDAA-3B92-4887-9B13-1708A8249322', name: 'Provinsi' },
      { id: 'BC414135-9B35-4ABB-BE65-187950CFD4FA', name: 'Pemerintah Pusat' },
    ];

    for (const el of data) {
      await this.depositeAreaRepository.save(el);
    }

    console.log('Deposite area seeded');
  }

  private async seedSourceOfRevenue() {
    // Delete all
    await this.sourceOfRevenueRepository.delete({});

    // Seed
    const data = [
      { id: '714BEBC3-5E48-4F42-88C6-DC1B76AAD3C3', name: 'PPh 21 Pegawai', category: '63AB3CC9-5E48-42D8-AF4A-DC1B76AAD3C3', parent: undefined },
      { id: randomUUID(), name: 'PPh 22 (Pot Put)', category: '63AB3CC9-5E48-42D8-AF4A-DC1B76AAD3C3', parent: undefined },
      { id: randomUUID(), name: 'PPh 23 (Pot Put)', category: '63AB3CC9-5E48-42D8-AF4A-DC1B76AAD3C3', parent: undefined },
      { id: randomUUID(), name: 'PPh 26 (Pot Put)', category: '63AB3CC9-5E48-42D8-AF4A-DC1B76AAD3C3', parent: undefined },
      { id: randomUUID(), name: 'PPh 4(2) (Pot Put)', category: '63AB3CC9-5E48-42D8-AF4A-DC1B76AAD3C3', parent: undefined },
      { id: randomUUID(), name: 'PPh 15 (Pot Put)', category: '63AB3CC9-5E48-42D8-AF4A-DC1B76AAD3C3', parent: undefined },
      { id: randomUUID(), name: 'PPh 25 Kredit Pajak', category: '63AB3CC9-5E48-42D8-AF4A-DC1B76AAD3C3', parent: undefined },
      { id: randomUUID(), name: 'PPh 29 SPT Badan KB', category: '63AB3CC9-5E48-42D8-AF4A-DC1B76AAD3C3', parent: undefined },
      { id: randomUUID(), name: 'PPh 22 Ekspor', category: '63AB3CC9-5E48-42D8-AF4A-DC1B76AAD3C3', parent: undefined },
      { id: randomUUID(), name: 'PPN MASA KB', category: '63AB3CC9-5E48-42D8-AF4A-DC1B76AAD3C3', parent: undefined },

      { id: randomUUID(), name: 'Pajak Bumi dan Bangunan', category: '79D06137-AC7E-46E9-A89F-AA7C6371CFD5', parent: undefined },
      { id: randomUUID(), name: 'Pajak Penggunaan Hutan (IPPKH)', category: '79D06137-AC7E-46E9-A89F-AA7C6371CFD5', parent: undefined },
      { id: randomUUID(), name: 'Pajak Alat Berat / Kendaraan Bermotor', category: '79D06137-AC7E-46E9-A89F-AA7C6371CFD5', parent: undefined },
      { id: randomUUID(), name: 'Pajak Penerangan Jalan', category: '79D06137-AC7E-46E9-A89F-AA7C6371CFD5', parent: undefined },
      { id: randomUUID(), name: 'Pajak Air Permukaan/ Bawah Tanah', category: '79D06137-AC7E-46E9-A89F-AA7C6371CFD5', parent: undefined },
      { id: randomUUID(), name: 'Pajak Daerah Jasa Boga', category: '79D06137-AC7E-46E9-A89F-AA7C6371CFD5', parent: undefined },
      { id: randomUUID(), name: 'Pajak Galian C', category: '79D06137-AC7E-46E9-A89F-AA7C6371CFD5', parent: undefined },
      { id: randomUUID(), name: 'Pajak Penggunaan Hutan', category: '79D06137-AC7E-46E9-A89F-AA7C6371CFD5', parent: undefined },
      { id: randomUUID(), name: 'Pajak Reklame', category: '79D06137-AC7E-46E9-A89F-AA7C6371CFD5', parent: undefined },

      { id: randomUUID(), name: 'Dividen', category: '85FBD7D6-CD06-46BF-A9AA-0BC2832ED872', parent: undefined },
      { id: randomUUID(), name: 'SP3D (Sumbangan Pihak ke-3)', category: '85FBD7D6-CD06-46BF-A9AA-0BC2832ED872', parent: undefined },
      { id: randomUUID(), name: 'BPHTB', category: '85FBD7D6-CD06-46BF-A9AA-0BC2832ED872', parent: undefined },
      { id: randomUUID(), name: 'Iuran Produksi Batubara (ROYALTI)', category: '85FBD7D6-CD06-46BF-A9AA-0BC2832ED872', parent: undefined },
      { id: randomUUID(), name: 'Retribusi Kebersihan', category: '85FBD7D6-CD06-46BF-A9AA-0BC2832ED872', parent: undefined },
      { id: randomUUID(), name: 'Retribusi IMB', category: '85FBD7D6-CD06-46BF-A9AA-0BC2832ED872', parent: undefined },
      { id: randomUUID(), name: 'Sewa Perairan', category: '85FBD7D6-CD06-46BF-A9AA-0BC2832ED872', parent: undefined },
      { id: randomUUID(), name: 'Retribusi Pemeriksaan Alat Pemadam Kebakaran', category: '85FBD7D6-CD06-46BF-A9AA-0BC2832ED872', parent: undefined },
      { id: randomUUID(), name: 'PNBP Pendaftaran, Pelayanan dan Pengukuran Aset', category: '85FBD7D6-CD06-46BF-A9AA-0BC2832ED872', parent: undefined },
      { id: randomUUID(), name: 'PNBP Biaya Hak Penggunaan (BHP)', category: '85FBD7D6-CD06-46BF-A9AA-0BC2832ED872', parent: undefined },
      { id: randomUUID(), name: 'PNBP Peralihan Aset', category: '85FBD7D6-CD06-46BF-A9AA-0BC2832ED872', parent: undefined },
      { id: '2B6C4456-EE57-4329-A320-CE81ACE426F5', name: 'Iuran Tetap / Kuasa Penambangan', category: '85FBD7D6-CD06-46BF-A9AA-0BC2832ED872', parent: undefined },
      { id: randomUUID(), name: 'KW.96PP0289 (Peranap) 18.230 Ha2', category: '85FBD7D6-CD06-46BF-A9AA-0BC2832ED872', parent: '2B6C4456-EE57-4329-A320-CE81ACE426F5' },
      { id: randomUUID(), name: 'KW.02.SS.2010 (Muara Tiga Besar) 2.866 Ha2', category: '85FBD7D6-CD06-46BF-A9AA-0BC2832ED872', parent: '2B6C4456-EE57-4329-A320-CE81ACE426F5' },
      { id: randomUUID(), name: 'KW.ME.01.ET.011 (Banko Barat) 4.500 Ha2', category: '85FBD7D6-CD06-46BF-A9AA-0BC2832ED872', parent: '2B6C4456-EE57-4329-A320-CE81ACE426F5' },
      { id: randomUUID(), name: 'KW.ME.01.ET.002 B (Banko Suban) 22.937 Ha2', category: '85FBD7D6-CD06-46BF-A9AA-0BC2832ED872', parent: '2B6C4456-EE57-4329-A320-CE81ACE426F5' },
      { id: randomUUID(), name: 'KW.01.SS.2010 Air Laya 7.621 Ha2', category: '85FBD7D6-CD06-46BF-A9AA-0BC2832ED872', parent: '2B6C4456-EE57-4329-A320-CE81ACE426F5' },
      { id: randomUUID(), name: 'KW.ME.01.ET.002 A (Banko Tengah) 2.423 Ha2', category: '85FBD7D6-CD06-46BF-A9AA-0BC2832ED872', parent: '2B6C4456-EE57-4329-A320-CE81ACE426F5' },
      { id: randomUUID(), name: 'Landrent Ombilin', category: '85FBD7D6-CD06-46BF-A9AA-0BC2832ED872', parent: '2B6C4456-EE57-4329-A320-CE81ACE426F5' },
    ];

    for (const el of data) {
      await this.sourceOfRevenueRepository.save(el);
    }

    console.log('Deposite area seeded');
  }

  private async seedProvinces() {
    // Delete all
    await this.provinceRepository.delete({});

    // Seed
    const data = [
      { id: '714BEBC3-0B6F-4F42-88C6-7624CBEDFB26', name: 'Sumsel' },
      { id: '93F0B69C-34DC-4CE8-9858-77AB0FF93F54', name: 'Kaltim' },
      { id: 'EDE4D6EF-05C8-47BF-835C-A7882694BF85', name: 'Lampung' },
    ];

    for (const el of data) {
      await this.provinceRepository.save(el);
    }

    console.log('provinces seeded');
  }

  private async seedDistrict() {
    // Delete all
    await this.districtRepository.delete({});

    // Seed
    const data = [
      { id: '92ACEDF6-7492-4CFE-B4FA-BE16A3279A98', name: 'kertapati', province: '714BEBC3-0B6F-4F42-88C6-7624CBEDFB26' },
      { id: '64628471-DCB6-4373-9D5A-BE3D328C3120', name: 'tarahan', province: '714BEBC3-0B6F-4F42-88C6-7624CBEDFB26' },
      { id: '2B6C4456-EE57-4329-A320-CE81ACE426F5', name: 'tanjung enim', province: '714BEBC3-0B6F-4F42-88C6-7624CBEDFB26' },
    ];

    for (const el of data) {
      await this.districtRepository.save(el);
    }

    console.log('district seeded');
  }

  private async seedAllocationPercentage() {
    // Delete all
    await this.allocationPercentageRepository.delete({});

    // Seed
    const data = [
      { id: randomUUID(), percentage: 30, deposite_area: '2F2C79AA-EED1-4C2A-A9D8-0E34E98E2844', source_of_revenue: '714BEBC3-5E48-4F42-88C6-DC1B76AAD3C3' },
      { id: randomUUID(), percentage: 30, deposite_area: '1D62FDAA-3B92-4887-9B13-1708A8249322', source_of_revenue: '714BEBC3-5E48-4F42-88C6-DC1B76AAD3C3' },
      { id: randomUUID(), percentage: 40, deposite_area: 'BC414135-9B35-4ABB-BE65-187950CFD4FA', source_of_revenue: '714BEBC3-5E48-4F42-88C6-DC1B76AAD3C3' },
    ];

    for (const el of data) {
      await this.allocationPercentageRepository.save(el);
    }

    console.log('Allocation Percentage seeded');
  }

  private async seedUserDistrict() {
    // Delete all
    await this.userDistrictRepository.delete({});

    // Seed
    const data = [
      { id: randomUUID(), user: '85FBD7D6-5E48-4CFE-B4FA-AA7C6371CFD5', district: '92ACEDF6-7492-4CFE-B4FA-BE16A3279A98' },
    ];

    for (const el of data) {
      await this.userDistrictRepository.save(el);
    }

    console.log('Allocation Percentage seeded');
  }
}
