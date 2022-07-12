import { HttpStatusCodes, newBinHttpError, Service } from '@bakku/platform';

import {
  AccountPasswordStatus,
  AuthenticatedAccountInfo,
  ChangePasswordBodyDto,
  IAccountService,
  RedisSignedInData,
  ResetPasswordBodyDto,
  SAccountService,
  SignInRequestBodyDto,
  SignInResponseDto,
} from 'src/definitions';
import { AccountEntity } from 'src/definitions/entities';
import { REDIS_KEYS } from '../constants';
import { HelperUtil } from '../utils';
import { getAccountRepository } from './repositories';

@Service(SAccountService)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class AuthenticationService implements IAccountService {
  async asyncSignIn(data: SignInRequestBodyDto): Promise<SignInResponseDto> {
    const account = await getAccountRepository().findOne({ where: { username: data.username } });
    const signInFailed = newBinHttpError({
      ...HttpStatusCodes.BAD_REQUEST,
      code: 'sign_in_failed',
      message: 'Wrong username/email or password',
    });
    if (!account) {
      throw signInFailed;
    }
    const { password } = HelperUtil.hashPassword(data.password, account.salt);
    if (password !== account.password) {
      throw signInFailed;
    }

    const { redis, configs } = global.applicationContexts;

    const jwtToken = HelperUtil.generateJwtToken({ id: account.id }, configs.jwt_secret);
    await redis.asyncSet<RedisSignedInData>(`${REDIS_KEYS.AUTHENTICATION_JWT}${jwtToken}`, {
      id: account.id,
    });

    const listTokens = (await redis.asyncGet<string[]>(`${REDIS_KEYS.AUTHENTICATION_USER_TOKENS}${account.id}`)) || [];
    listTokens.push(jwtToken);
    await redis.asyncSet<string[]>(`${REDIS_KEYS.AUTHENTICATION_USER_TOKENS}${account.id}`, listTokens);

    return {
      token: jwtToken,
    };
  }

  async asyncSignOut(token: string): Promise<void> {
    const { redis } = global.applicationContexts;
    const tokenRedisKey = `${REDIS_KEYS.AUTHENTICATION_JWT}${token}`;
    await redis.asyncDelete(tokenRedisKey);
  }

  async asyncDetectAccountFromToken(token: string, includeDetail?: boolean): Promise<AuthenticatedAccountInfo> {
    const { redis, configs } = global.applicationContexts;
    const data = await HelperUtil.checkJWTToken(token, configs.jwt_secret, redis, true);

    let account = data
      ? await getAccountRepository().findOne({
          where: { id: data.id },
          relations: includeDetail
            ? {
                mentorInfo: true,
                studentInfo: true,
              }
            : {},
        })
      : undefined;
    account = account || undefined;
    return { account: account, token };
  }

  async asyncChangePassword(account: AccountEntity, data: ChangePasswordBodyDto): Promise<void> {
    const { redis, logger } = global.applicationContexts;
    if (account.passwordStatus === AccountPasswordStatus.Changed) {
      throw newBinHttpError({
        ...HttpStatusCodes.BAD_REQUEST,
        code: 'password is changed',
        message: 'Please contact admin to change your password again!',
      });
    }
    const { password: oldPassword } = HelperUtil.hashPassword(data.oldPassword, account.salt);
    if (oldPassword !== account.password) {
      throw newBinHttpError({
        ...HttpStatusCodes.BAD_REQUEST,
        code: 'invalid_old_password',
        message: 'your old password is not correct!',
      });
    }
    const { password, salt } = HelperUtil.hashPassword(data.newPassword);
    await getAccountRepository().update(account.id, { password, salt, passwordStatus: AccountPasswordStatus.Changed });

    try {
      const listTokens =
        (await redis.asyncGet<string[]>(`${REDIS_KEYS.AUTHENTICATION_USER_TOKENS}${account.id}`)) || [];
      for (const token of listTokens) {
        await redis.asyncDelete(`${REDIS_KEYS.AUTHENTICATION_JWT}${token}`);
      }
      await redis.asyncSet<string[]>(`${REDIS_KEYS.AUTHENTICATION_USER_TOKENS}${account.id}`, []);
    } catch (error) {
      logger.error('asyncChangePassword remove old token in cache error', error);
    }
  }

  async asyncResetPassword(data: ResetPasswordBodyDto): Promise<void> {
    const { redis, logger } = global.applicationContexts;

    const { password, salt } = HelperUtil.hashPassword(data.newPassword);
    await getAccountRepository().update(data.id, { password, salt, passwordStatus: AccountPasswordStatus.NeedChange });

    try {
      const listTokens = (await redis.asyncGet<string[]>(`${REDIS_KEYS.AUTHENTICATION_USER_TOKENS}${data.id}`)) || [];
      for (const token of listTokens) {
        await redis.asyncDelete(`${REDIS_KEYS.AUTHENTICATION_JWT}${token}`);
      }
      await redis.asyncSet<string[]>(`${REDIS_KEYS.AUTHENTICATION_USER_TOKENS}${data.id}`, []);
    } catch (error) {
      logger.error('asyncChangePassword remove old token in cache error', error);
    }
  }
}
