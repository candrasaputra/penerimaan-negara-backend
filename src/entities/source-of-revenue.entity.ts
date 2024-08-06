import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from './category.entity';

@Entity()
export class SourceOfRevenue {
  @PrimaryColumn({ name: 'id', type: 'uuid' })
  id = '';

  @Column()
  name: string;

  @Column({nullable: true})
  parent?: string | null;

  @ManyToOne(() => Category, (p) => p.id, {
    cascade: ['update', 'remove'],
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category | string | undefined;
}
