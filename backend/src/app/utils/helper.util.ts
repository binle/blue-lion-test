/* eslint-disable @typescript-eslint/no-explicit-any */
import crypto from 'crypto';
import fsExtra from 'fs-extra';
import { merge } from 'lodash';
import path from 'path';
import * as uuid from 'uuid';
import * as jsonwebtoken from 'jsonwebtoken';
import { IRedisGlobal, RedisSignedInData } from 'src/definitions';
import { HttpStatusCodes, newBinHttpError } from '@bakku/platform';
import { REDIS_KEYS } from '../constants';

export class HelperUtil {
  static getFileExtensions(folderPath: string): string[] {
    const getAllExtensions = (folderPath: string) => {
      let results: { [key: string]: boolean } = {};
      const listItem = fsExtra.readdirSync(folderPath);
      for (const item of listItem) {
        const itemPath = path.join(folderPath, item);
        const stat = fsExtra.statSync(itemPath);
        if (stat.isFile()) {
          results[path.extname(item).substring(1)] = true;
        } else if (stat.isDirectory()) {
          results = merge(results, getAllExtensions(itemPath));
        }
      }
      return results;
    };
    return Object.keys(getAllExtensions(folderPath));
  }

  static hashPassword(password: string, salt?: string): { password: string; salt: string } {
    const tempSalt = salt ? Buffer.from(salt, 'hex') : crypto.randomBytes(32);
    const hash = crypto.pbkdf2Sync(Buffer.from(password), tempSalt, 100000, 64, 'sha512');
    return {
      password: hash.toString('hex'),
      salt: tempSalt.toString('hex'),
    };
  }

  static generateJwtToken<T extends jsonwebtoken.JwtPayload>(payload: T, secret: string): string {
    return jsonwebtoken.sign(payload, secret);
  }

  static verifyJwtToken<T extends jsonwebtoken.JwtPayload>(token: string, secret: string): T {
    return jsonwebtoken.verify(token, secret) as T;
  }

  static async checkJWTToken(
    token: string,
    secret: string,
    redis: IRedisGlobal,
    shouldNotThrowError?: boolean
  ): Promise<RedisSignedInData | undefined> {
    try {
      if (!HelperUtil.verifyJwtToken(token, secret)) {
        if (shouldNotThrowError) {
          return undefined;
        }
        throw newBinHttpError({
          ...HttpStatusCodes.UNAUTHORIZED,
          code: 'invalid_jwt_token',
          message: 'Invalid jwt token!',
        });
      }
      const data = await redis.asyncGet<RedisSignedInData>(`${REDIS_KEYS.AUTHENTICATION_JWT}${token}`);
      if (!data?.id) {
        if (shouldNotThrowError) {
          return undefined;
        }
        throw newBinHttpError({
          ...HttpStatusCodes.UNAUTHORIZED,
          code: 'invalid_jwt_token',
          message: 'Invalid jwt token!',
        });
      }
      return data;
    } catch (error) {
      if (shouldNotThrowError) {
        return undefined;
      }
      throw newBinHttpError({
        ...HttpStatusCodes.UNAUTHORIZED,
        code: 'invalid_jwt_token',
        message: (error as any).message || 'Invalid jwt token!',
      });
    }
  }
}

export const uuidV4 = (): string => uuid.v4();
