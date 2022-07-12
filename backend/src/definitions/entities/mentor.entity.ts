import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { ColumnText, ColumnTextOptional, StoredEntity, PrimaryColumnText } from './../common';
import { AccountEntity } from './account.entity';

@Entity({ name: 'mentor' })
export class MentorEntity extends StoredEntity {
  @PrimaryColumnText({ name: 'mentor_id' })
  mentorId: string;

  @OneToOne(() => AccountEntity)
  @JoinColumn({ name: 'mentor_id' })
  account?: AccountEntity;

  @ColumnText({ name: 'full_name' })
  fullName: string;

  @ColumnTextOptional()
  description?: string;

  @Column('jsonb', { nullable: true })
  extra?: { key: string; value: string }[];
}
