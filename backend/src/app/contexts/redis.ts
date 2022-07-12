/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient, RedisClientOptions, RedisClientType } from 'redis';
import { IRedisGlobal } from 'src/definitions';

export const createRedis = async (option: RedisClientOptions): Promise<IRedisGlobal> => {
  // if (!option || !option.host || !option.port) {
  //   throw new Error('Redis required server configuration!');
  // }

  const redisClient = createClient(option);

  await redisClient.connect();

  const asyncGet = async <T extends any>(key: string): Promise<T | undefined> => {
    try {
      const data = await redisClient.get(key);
      return JSON.parse(data as string);
    } catch (error) {
      return undefined;
    }
  };

  const asyncGetWithDeleteOption = async <T extends any>(
    key: string,
    deleteAfterGet?: boolean
  ): Promise<T | undefined> => {
    const returnData = await asyncGet<T>(key);
    deleteAfterGet && (await asyncDelete(key));
    return returnData;
  };

  const asyncSet = async <T extends any>(key: string, data: T, expiredTime?: number): Promise<void> => {
    expiredTime
      ? await redisClient.set(key, JSON.stringify(data), { EX: expiredTime * 1000 })
      : await redisClient.set(key, JSON.stringify(data));
  };

  const asyncDelete = async (key: string): Promise<void> => {
    await redisClient.del(key);
  };

  const redis: IRedisGlobal = {
    redisClient: redisClient as RedisClientType,
    asyncGet: asyncGetWithDeleteOption,
    asyncSet,
    asyncDelete,
  };

  return redis;
};
