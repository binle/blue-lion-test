import { IObjectSchema, StringRequireSchema } from '@bakku/platform';

export * from './context.definition';
export * from './entity-common.definition';
export * from './typeorm.definition';

export interface IDataError {
  message: string;
  code?: string;
}

export const HeaderSignedInProperties: IObjectSchema = {
  type: 'object',
  validation: { isRequired: true },
  properties: {
    authorization: StringRequireSchema,
  },
};

export const BinHttpErrorCodes = {
  invalid_cors: {
    code: 'invalid_cors',
    message: 'Not allowed by CORS!',
  },
  invalid_authorized_state: {
    code: 'invalid_authorized_state',
    // eslint-disable-next-line quotes
    message: "Your authorized account's state can not use this API!",
  },
};
