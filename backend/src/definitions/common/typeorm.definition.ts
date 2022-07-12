import { Column, ColumnOptions, PrimaryColumn, PrimaryColumnOptions } from 'typeorm';

export const PrimaryColumnText = (options?: PrimaryColumnOptions): PropertyDecorator =>
  PrimaryColumn({ type: 'text', ...options });

export const ColumnOptional = (options?: ColumnOptions): PropertyDecorator => Column({ nullable: true, ...options });

export const ColumnText = (options?: ColumnOptions): PropertyDecorator => Column({ type: 'text', ...options });
export const ColumnTextOptional = (options?: ColumnOptions): PropertyDecorator =>
  Column({ type: 'text', nullable: true, ...options });

export const ColumnDateTime = (options?: ColumnOptions): PropertyDecorator =>
  Column({ type: 'timestamp without time zone', ...options });
export const ColumnDateTimeOptional = (options?: ColumnOptions): PropertyDecorator =>
  Column({ type: 'timestamp without time zone', nullable: true, ...options });
