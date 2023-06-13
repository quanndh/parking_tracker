import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class UUIDEntity extends BaseEntity {
  @Column('bigint', {
    primary: true,
    unsigned: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: ' created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
