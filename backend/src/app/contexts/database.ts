/* eslint-disable @typescript-eslint/no-explicit-any */
import { join } from 'path';
import { IDatabaseConfigOptions } from 'src/definitions';
import { DataSource } from 'typeorm';

export const initDatabase = async (options: IDatabaseConfigOptions, rootPath: string): Promise<DataSource> => {
  const appDatabase = new DataSource({
    type: 'postgres',
    host: options.host,
    port: options.port,
    username: options.username,
    password: options.password,
    database: options.database,
    synchronize: options.synchronize || false,
    logging: true,
    entities: [join(rootPath, '**/*.entity.js')],
    subscribers: [],
    migrations: [],
  });
  await appDatabase.initialize();
  return appDatabase;
};
