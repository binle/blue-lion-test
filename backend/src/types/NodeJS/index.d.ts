import { ILogger } from '@bakku/logger';
import { IConfigGlobal } from 'src/definitions';
import { DataSource } from 'typeorm';

declare global {
  namespace NodeJS {
    interface Global {
      applicationContexts: {
        configs: IConfigGlobal;
        database: DataSource;
        redis: IRedisGlobal;
        logger: ILogger;
        rootPath: string;
      };
    }
  }
}
