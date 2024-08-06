
import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { Role } from '../enums/role.enum';
import { UserDistrict } from './user-district.entity';

@Entity()
export class User {
  @PrimaryColumn({ name: 'id', type: 'uuid' })
  id = '';

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({default: Role.SPESIALIS_KEUANGAN})
  role: Role;

  @OneToMany(() => UserDistrict, (tp) => tp.user)
    districts?: UserDistrict[] | undefined;
}
