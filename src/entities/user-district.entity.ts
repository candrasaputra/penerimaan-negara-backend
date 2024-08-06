import { Entity, Column, PrimaryColumn, JoinColumn, ManyToOne } from 'typeorm';
import { District } from './district.entity';
import { User } from './user.entity';

@Entity()
export class UserDistrict {
  @PrimaryColumn({ name: 'id', type: 'uuid' })
  id = '';

  @ManyToOne(() => User, (u) => u.id, {
    cascade: ['update', 'remove'],
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User | string | undefined;

  @ManyToOne(() => District, (d) => d.id, {
    cascade: ['update', 'remove'],
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'district_id' })
  district: District | string | undefined;
}
