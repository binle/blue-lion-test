import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { ColumnText, ColumnTextOptional, StoredEntity, PrimaryColumnText } from '../common';
import { AccountEntity } from './account.entity';

@Entity({ name: 'student' })
export class StudentEntity extends StoredEntity {
  @PrimaryColumnText({ name: 'student_id' })
  studentId: string;

  @OneToOne(() => AccountEntity)
  @JoinColumn({ name: 'student_id' })
  account?: AccountEntity;

  @ColumnText({ name: 'full_name' })
  fullName: string;

  @ColumnTextOptional()
  description?: string;

  @Column('jsonb', { nullable: true })
  extra?: { key: string; value: string }[];
}
