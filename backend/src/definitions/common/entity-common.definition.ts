import { BaseEntity, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export abstract class IdentifyEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}

export abstract class StoredEntity extends BaseEntity {
  @CreateDateColumn({ name: 'created_at', type: 'timestamp without time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'modified_at', type: 'timestamp without time zone' })
  modifiedAt: Date;
}

export abstract class MyBaseEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp without time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'modified_at', type: 'timestamp without time zone' })
  modifiedAt: Date;
}

export enum AccountPasswordStatus {
  Changed = 'Changed',
  NeedChange = 'Need-change',
}

export enum AccountType {
  Admin = 'Admin',
  Mentor = 'Mentor',
  Student = 'Student',
}

export enum OrderType {
  ASC = 'ASC',
  DESC = 'DESC',
}
