import { Entity, Column, PrimaryColumn, JoinColumn, ManyToOne } from 'typeorm';
import { Province } from './province.entity';

@Entity()
export class District {
  @PrimaryColumn({ name: 'id', type: 'uuid' })
  id = '';

  @Column({ unique: true })
  name: string;

  @ManyToOne(() => Province, (p) => p.id, {
    cascade: ['update', 'remove'],
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'province_id' })
  province: Province | string | undefined;
}
