/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-useless-catch */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Body,
  Controller,
  ExRequest,
  Get,
  Headers,
  InjectService,
  Middleware,
  MiddlewareCustom,
  Post,
  Req,
  ResponseSchemaSuccess,
  ResponseSchemaSuccessObject,
} from '@bakku/platform';

import {
  AccountController,
  AccountType,
  ChangePasswordBodyDto,
  CurrentAccountInfoResponseDto,
  HeaderSignedInProperties,
  IAccountService,
  ResetPasswordBodyDto,
  SAccountService,
  SignInRequestBodyDto,
  SignInResponseDto,
} from 'src/definitions';
import { AccountEntity } from 'src/definitions/entities';
import {
  getRequireAccountTypeMiddleWare,
  requireNotSignedInMiddleWare,
  requireSignedInMiddleWare,
} from '../middleware';

@Controller({
  name: Symbol('AccountController'),
  path: AccountController.path,
})
export class AccountControllerImpl {
  @InjectService(SAccountService)
  private accountService: IAccountService;

  @Post(AccountController.children.signIn, 'Sign In API')
  @Middleware(requireNotSignedInMiddleWare)
  @ResponseSchemaSuccess({ propertyType: SignInResponseDto })
  async asyncSignInApi(@Body() body: SignInRequestBodyDto): Promise<SignInResponseDto> {
    const { logger } = global.applicationContexts;
    logger.info('========== AccountController API asyncSignInApi start', { username: body.username });
    logger.debug('========== AccountController API asyncSignInApi data', body);
    let result;
    try {
      result = await this.accountService.asyncSignIn(body);
    } catch (error) {
      logger.error('========== AccountController API asyncSignInApi error :', error);
      throw error;
    }
    logger.info('========== AccountController API asyncSignInApi success ', { username: body.username });
    return result;
  }

  @Post(AccountController.children.signOut, 'Sign out API')
  @Middleware(requireSignedInMiddleWare)
  @ResponseSchemaSuccess({ propertyType: SignInResponseDto })
  async asyncSignOutApi(@Headers(HeaderSignedInProperties) _header: any, @Req() req: ExRequest): Promise<void> {
    const { logger } = global.applicationContexts;
    logger.info('========== AccountController API asyncSignOutApi start');
    logger.debug('========== AccountController API asyncSignOutApi', {
      authorization: req.headers.authorization,
      username: req.accountData?.account?.username,
    });
    let result;
    try {
      result = await this.accountService.asyncSignOut(req.accountData?.token as string);
    } catch (error) {
      logger.error('========== AccountController API asyncSignOutApi error :', error);
      throw error;
    }
    logger.info('========== AccountController API asyncSignOutApi success ', {
      authorization: req.headers.authorization,
      username: req.accountData?.account?.username,
    });
    return result;
  }

  @Post(AccountController.children.changePassword, 'Change password API')
  @Middleware(requireSignedInMiddleWare)
  @ResponseSchemaSuccess({ type: 'object', description: 'no things' })
  async asyncChangePasswordApi(
    @Headers(HeaderSignedInProperties) _header: any,
    @Body() body: ChangePasswordBodyDto,
    @Req() req: ExRequest
  ): Promise<void> {
    const { logger } = global.applicationContexts;
    logger.info('========== AccountController API asyncChangePasswordApi start');
    logger.debug('========== AccountController API asyncChangePasswordApi', {
      username: req.accountData?.account?.username,
    });
    let result;
    try {
      result = await this.accountService.asyncChangePassword(req.accountData?.account as AccountEntity, body);
    } catch (error) {
      logger.error('========== AccountController API asyncChangePasswordApi error :', error);
      throw error;
    }
    logger.info('========== AccountController API asyncChangePasswordApi success ', {
      username: req.accountData?.account?.username,
    });
    return result;
  }

  @Post(AccountController.children.setPassword, 'Change password API')
  @Middleware(requireSignedInMiddleWare)
  @MiddlewareCustom(getRequireAccountTypeMiddleWare.bind(null, [AccountType.Admin]))
  @ResponseSchemaSuccessObject({ description: 'no things' })
  async asyncSetPasswordApi(
    @Headers(HeaderSignedInProperties) _header: any,
    @Body() body: ResetPasswordBodyDto
  ): Promise<void> {
    const { logger } = global.applicationContexts;
    logger.info('========== AccountController API asyncSetPasswordApi start');
    logger.debug('========== AccountController API asyncSetPasswordApi', body);
    let result;
    try {
      result = await this.accountService.asyncResetPassword(body);
    } catch (error) {
      logger.error('========== AccountController API asyncSetPasswordApi error :', error);
      throw error;
    }
    logger.info('========== AccountController API asyncSetPasswordApi success ', {
      id: body.id,
    });
    return result;
  }

  @Get(AccountController.children.info, 'Current Account Information')
  @Middleware(requireSignedInMiddleWare)
  @ResponseSchemaSuccessObject({ description: 'no things' })
  async asyncGetCurrentAccountInformationApi(
    @Headers(HeaderSignedInProperties) _header: any,
    @Req() req: ExRequest
  ): Promise<CurrentAccountInfoResponseDto> {
    const { logger } = global.applicationContexts;
    logger.info('========== AccountController API asyncGetCurrentAccountInformationApi start');
    let accountEntity;
    try {
      const result = await this.accountService.asyncDetectAccountFromToken(req.accountData?.token as string, true);
      accountEntity = result.account as AccountEntity;
      logger.info('========== AccountController API asyncGetCurrentAccountInformationApi success ');
      return {
        id: accountEntity.id,
        username: accountEntity.username,
        accountType: accountEntity?.accountType,
        passwordStatus: accountEntity.passwordStatus,
        mentorInfo: accountEntity.mentorInfo,
        studentInfo: accountEntity.studentInfo,
      };
    } catch (error) {
      logger.error('========== AccountController API asyncGetCurrentAccountInformationApi error :', error);
      throw error;
    }
  }
}
