import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { DepositeArea } from './deposit-area.entity';
import { Deposite } from './deposite.entity';

@Entity()
export class DepositeBreakdown {
  @PrimaryColumn({ name: 'id', type: 'uuid' })
  id = '';

  @ManyToOne(() => Deposite, (d) => d.id, {
    cascade: ['update', 'remove'],
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'deposite_id' })
  deposite: Deposite | string | undefined;

  @ManyToOne(() => DepositeArea, (da) => da.id, {
    cascade: ['update', 'remove'],
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'deposite_area_id' })
  deposite_area: DepositeArea | string | undefined;

  @Column()
  amount: number;
}
