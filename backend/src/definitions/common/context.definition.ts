import { LoggerOptions } from '@bakku/logger';
import { RedisClientType } from 'redis';

export interface IDatabaseConfigOptions {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize?: boolean;
}

export interface IConfigGlobal {
  host: string;
  port: string | number;
  allowed_origin_urls: string[];
  log_config: LoggerOptions;
  jwt_secret: string;
  database_config: IDatabaseConfigOptions;
  redis_config: string;
}

export interface IRedisGlobal {
  redisClient: RedisClientType;
  asyncGet<T = unknown>(key: string, deleteAfterGet?: boolean): Promise<T | undefined>;

  asyncSet<T = unknown>(key: string, data: T, expiredTime?: number): Promise<void>;
  asyncDelete(key: string): Promise<void>;
}

export interface RedisSignedInData {
  id: string;
}
