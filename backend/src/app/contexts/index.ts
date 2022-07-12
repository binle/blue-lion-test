import { createLogger } from '@bakku/logger';
import { newBinHttpError } from '@bakku/platform';
import axios, { AxiosResponse } from 'axios';
import { loadConfig } from './configs';
import { initDatabase } from './database';
import { createRedis } from './redis';

export const initialization = async (rootPath: string): Promise<void> => {
  const configs = loadConfig();
  const logger = createLogger(configs.log_config);
  const database = await initDatabase(configs.database_config, rootPath);
  const redis = await createRedis({ url: configs.redis_config });
  global.applicationContexts = {
    configs,
    redis,
    logger,
    database,
    rootPath,
  };

  axios.interceptors.response.use(
    (response: AxiosResponse) => response,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (error: any) => {
      const message =
        error.response?.data?.error?.message ||
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.response?.data?.Message ||
        error.message;
      const code = error.response?.data?.error?.code || error.response?.data?.code || error.response?.data?.Code;
      const status = error.response?.status || 500;
      const httpError = newBinHttpError({ message, status }, { code, message });
      throw httpError;
    }
  );
};
