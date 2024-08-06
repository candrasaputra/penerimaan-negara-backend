
import { Role } from '../enums/role.enum';
import { Entity, Column, PrimaryColumn } from 'typeorm';

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
}
