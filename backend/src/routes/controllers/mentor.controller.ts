/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Body,
  Controller,
  Delete,
  Get,
  InjectService,
  IObjectSchema,
  IStringSchema,
  Middleware,
  MiddlewareCustom,
  Params,
  Post,
  Queries,
  ResponseSchemaSuccess,
  ValidationError,
} from '@bakku/platform';

import {
  AccountType,
  DetailParams,
  IMentorService,
  ListQuery,
  MentorBaseResponseDto,
  MentorController,
  MentorDetailResponseDto,
  SavedMentorRequestDto,
  SMentorService,
} from 'src/definitions';
import { getRequireAccountTypeMiddleWare, requireSignedInMiddleWare } from '../middleware';

@Controller({
  name: Symbol('MentorController'),
  path: MentorController.path,
})
export class MentorControllerImpl {
  @InjectService(SMentorService)
  private mentorService: IMentorService;

  @Get(MentorController.children.detail, 'Get detail mentor')
  @Middleware(requireSignedInMiddleWare)
  @MiddlewareCustom(getRequireAccountTypeMiddleWare.bind(null, [AccountType.Admin, AccountType.Student]))
  @ResponseSchemaSuccess(
    { type: 'object', propertyType: MentorDetailResponseDto } as IObjectSchema,
    'Return detail information of a mentor!'
  )
  async asyncGetDetail(@Params() { id }: DetailParams): Promise<MentorDetailResponseDto | undefined> {
    const { logger } = global.applicationContexts;
    logger.info('========== MentorController API asyncGetDetail start', id);
    try {
      const result = await this.mentorService.asyncGetMentor(id);
      logger.info('========== MentorController API asyncGetDetail success ');
      return result;
    } catch (error) {
      logger.error('========== MentorController API asyncGetDetail error :', error);
      throw error;
    }
  }

  @Get(MentorController.children.list, 'Get list mentors')
  @Middleware(requireSignedInMiddleWare)
  @MiddlewareCustom(getRequireAccountTypeMiddleWare.bind(null, [AccountType.Admin, AccountType.Student]))
  @ResponseSchemaSuccess({ type: 'string' } as IStringSchema, 'Return list mentors!')
  async asyncGetList(@Queries() data: ListQuery): Promise<{ mentors: MentorBaseResponseDto[]; count: number }> {
    const { logger } = global.applicationContexts;
    logger.info('========== MentorController API asyncGetList start');
    try {
      const result = await this.mentorService.asyncListMentor(data);
      logger.info('========== MentorController API asyncGetList success ');
      return result;
    } catch (error) {
      logger.error('========== MentorController API asyncGetList error :', error);
      throw error;
    }
  }

  @Post(MentorController.children.save, 'Create mentor')
  @Middleware(requireSignedInMiddleWare)
  @MiddlewareCustom(getRequireAccountTypeMiddleWare.bind(null, [AccountType.Admin]))
  @ResponseSchemaSuccess({ type: 'string' } as IStringSchema, 'Create new mentor!')
  async asyncCreate(
    @Body({
      validation: {
        validate: (body?: any) => {
          const data: SavedMentorRequestDto = body as SavedMentorRequestDto;
          if (!data?.mentorId && !data?.signInData?.password) {
            return new ValidationError('body', 'body.signInData.password is required!');
          }
          return undefined;
        },
      },
    })
    data: SavedMentorRequestDto
  ): Promise<void> {
    const { logger } = global.applicationContexts;
    logger.info('========== MentorController API asyncCreate start');
    logger.debug('========== MentorController API asyncCreate start', data);
    try {
      await this.mentorService.asyncSaveMentor(data);
      logger.info('========== MentorController API asyncCreate success ');
    } catch (error) {
      logger.error('========== MentorController API asyncCreate error :', error);
      throw error;
    }
  }

  @Delete(MentorController.children.detail, 'Delete mentor')
  @Middleware(requireSignedInMiddleWare)
  @MiddlewareCustom(getRequireAccountTypeMiddleWare.bind(null, [AccountType.Admin]))
  @ResponseSchemaSuccess({ type: 'string' } as IStringSchema, 'Delete a mentor!')
  async asyncDeleteDetail(@Params() { id }: DetailParams): Promise<void> {
    const { logger } = global.applicationContexts;
    logger.info('========== MentorController API asyncDeleteDetail start', id);
    try {
      await this.mentorService.asyncDeleteMentor(id);
      logger.info('========== MentorController API asyncDeleteDetail success ');
    } catch (error) {
      logger.error('========== MentorController API asyncDeleteDetail error :', error);
      throw error;
    }
  }
}
