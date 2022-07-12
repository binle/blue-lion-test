import { AuthenticatedAccountInfo } from 'src/definitions';

declare global {
  namespace Express {
    interface Request {
      accountData?: AuthenticatedAccountInfo;
    }
  }
}
