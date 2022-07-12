import {
  ExNextFunction,
  ExRequest,
  ExRequestHandler,
  ExResponse,
  HttpStatusCodes,
  newBinHttpError,
  singletonContainer,
} from '@bakku/platform';
import { AccountType, IAccountService, SAccountService } from 'src/definitions';

export const userDetectionMiddleWare: ExRequestHandler = async (
  req: ExRequest,
  _res: ExResponse,
  next: ExNextFunction
) => {
  let token = '';
  const tokenString = req.headers.authorization || '';
  if (tokenString.startsWith('Bearer')) {
    token = tokenString.replace('Bearer ', '');
  }
  const accountService: IAccountService = singletonContainer.get<IAccountService>(SAccountService);
  const data = await accountService.asyncDetectAccountFromToken(token);
  req.accountData = data;
  next();
};

export const requireSignedInMiddleWare: ExRequestHandler = (req: ExRequest, _res: ExResponse, next: ExNextFunction) => {
  if (!req.accountData?.account?.id) {
    return next(
      newBinHttpError({
        ...HttpStatusCodes.UNAUTHORIZED,
        code: 'unauthorized_user',
        message: 'You need login first!',
      })
    );
  }
  next();
};

export const requireNotSignedInMiddleWare: ExRequestHandler = (
  req: ExRequest,
  _res: ExResponse,
  next: ExNextFunction
) => {
  if (req.accountData?.account?.id) {
    return next(
      newBinHttpError({
        ...HttpStatusCodes.UNAUTHORIZED,
        code: 'authorized_user',
        message: 'API for anonymous API',
      })
    );
  }
  next();
};

export const getRequireAccountTypeMiddleWare = (accountTypes: AccountType[]): ExRequestHandler => {
  return (req: ExRequest, _res: ExResponse, next: ExNextFunction) => {
    if (!accountTypes.includes(req.accountData?.account?.accountType as AccountType)) {
      return next(
        newBinHttpError({
          ...HttpStatusCodes.FORBIDDEN,
          code: 'wrong_permission',
          message: 'You are not allowed!',
        })
      );
    }
    next();
  };
};
