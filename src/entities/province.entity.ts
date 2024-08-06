import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { District } from './district.entity';

@Entity()
export class Province {
  @PrimaryColumn({ name: 'id', type: 'uuid' })
  id = '';

  @Column({ unique: true })
  name: string;

  @OneToMany(() => District, (d) => d.province)
  district?: District[] | undefined;
}
