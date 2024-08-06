import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { SourceOfRevenue } from './source-of-revenue.entity';
import { District } from './district.entity';
import { DepositeBreakdown } from './deposite-breakdown.entity';

@Entity()
export class Deposite {
  @PrimaryColumn({ name: 'id', type: 'uuid' })
  id = '';

  @ManyToOne(() => District, (s) => s.id, {
    cascade: ['update', 'remove'],
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'district_id' })
  district: District | string | undefined;

  @ManyToOne(() => SourceOfRevenue, (s) => s.id, {
    cascade: ['update', 'remove'],
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'source_of_revenue_id' })
  source_of_revenue: SourceOfRevenue | string | undefined;

  @Column()
  amount: number;

  @Column()
  date?: Date | null | undefined;

  @OneToMany(() => DepositeBreakdown, (db) => db.deposite)
    breakdown?: DepositeBreakdown[] | undefined;
}
