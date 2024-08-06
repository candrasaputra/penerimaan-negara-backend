import { Entity, Column, PrimaryColumn, JoinColumn, ManyToOne } from 'typeorm';
import { SourceOfRevenue } from './source-of-revenue.entity';
import { DepositeArea } from './deposit-area.entity';

@Entity()
export class AllocationPercentage {
  @PrimaryColumn({ name: 'id', type: 'uuid' })
  id = '';

  @Column()
  percentage: number;

  @ManyToOne(() => DepositeArea, (da) => da.id, {
    cascade: ['update', 'remove'],
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'deposite_area_id' })
  deposite_area: DepositeArea | string | undefined;

  @ManyToOne(() => SourceOfRevenue, (s) => s.id, {
    cascade: ['update', 'remove'],
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'source_of_revenue_id' })
  source_of_revenue: SourceOfRevenue | string | undefined;
}
