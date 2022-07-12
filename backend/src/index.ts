/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ExRequestHandler,
  ExResponse,
  HttpStatusCodes,
  newBinHttpError,
  ResponseDataSuccess,
  startServer,
} from '@bakku/platform';
import cors, { CorsOptions } from 'cors';
import 'reflect-metadata';
import { initialization } from './app';
import './routes';
import { userDetectionMiddleWare } from './routes/middleware';

export const getDefaultCorsHandler = (whitelist: string[]): ExRequestHandler => {
  const corsOptions: CorsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      console.log('getDefaultCorsHandler ========== origin :', { origin, whitelist });
      if (!origin || whitelist.includes('*') || whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(
          newBinHttpError(HttpStatusCodes.METHOD_NOT_ALLOWED, { code: 'invalid_cors', message: 'Not allowed by CORS!' })
        );
      }
    },
  };
  return cors(corsOptions);
};

(async () => {
  await initialization(__dirname);

  startServer({
    host: global.applicationContexts.configs.host,
    port: Number(global.applicationContexts.configs.port),
    apiPrefix: 'api',
    logger: global.applicationContexts.logger,

    documentOptions: {
      docPath: 'doc',
    },

    appHandlers: [
      getDefaultCorsHandler(global.applicationContexts.configs.allowed_origin_urls),
      userDetectionMiddleWare,
    ],

    dataHandlerOptions: {
      dataHandler: (data: any, res: ExResponse) => {
        res.send(data);
      },
      getSuccessSchema: (response?: ResponseDataSuccess) =>
        response?.data || {
          description: 'Response in success case:',
        },
    },
  });
})().catch((error) => {
  const { logger } = global.applicationContexts || {};
  (logger ? logger : console).error('server error ========', error);
  // stopServer(server);
});
