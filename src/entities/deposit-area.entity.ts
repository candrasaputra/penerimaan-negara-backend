import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class DepositeArea {
  @PrimaryColumn({ name: 'id', type: 'uuid' })
  id = '';

  @Column()
  name: string;
}
