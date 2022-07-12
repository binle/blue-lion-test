import { Entity, OneToOne } from 'typeorm';
import { AccountPasswordStatus, AccountType, ColumnText, MyBaseEntity } from '../common';
import { MentorEntity } from './mentor.entity';
import { StudentEntity } from './student.entity';

@Entity({ name: 'account' })
export class AccountEntity extends MyBaseEntity {
  @ColumnText()
  username: string;

  @ColumnText()
  password: string;

  @ColumnText()
  salt: string;

  @ColumnText({ name: 'password_status' })
  passwordStatus: AccountPasswordStatus;

  @ColumnText({ name: 'account_type' })
  accountType: AccountType;

  @OneToOne(() => MentorEntity, (mentor) => mentor.account, { nullable: true })
  mentorInfo?: MentorEntity;

  @OneToOne(() => StudentEntity, (student) => student.account, { nullable: true })
  studentInfo?: StudentEntity;
}
