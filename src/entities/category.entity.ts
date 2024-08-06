import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { SourceOfRevenue } from './source-of-revenue.entity';

@Entity()
export class Category {
  @PrimaryColumn({ name: 'id', type: 'uuid' })
  id = '';

  @Column({ unique: true })
  name: string;

  @OneToMany(() => SourceOfRevenue, sr => sr.id)
  sourceofrevenue: SourceOfRevenue[];
}
