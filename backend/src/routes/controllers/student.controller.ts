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
} from '@bakku/platform';

import {
  AccountType,
  SavedStudentRequestDto,
  DetailParams,
  IStudentService,
  ListQuery,
  SStudentService,
  StudentBaseResponseDto,
  StudentController,
  StudentDetailResponseDto,
} from 'src/definitions';
import { getRequireAccountTypeMiddleWare, requireSignedInMiddleWare } from '../middleware';

@Controller({
  name: Symbol('StudentController'),
  path: StudentController.path,
})
export class StudentControllerImpl {
  @InjectService(SStudentService)
  private studentService: IStudentService;

  @Get(StudentController.children.detail, 'Get detail student')
  @Middleware(requireSignedInMiddleWare)
  @MiddlewareCustom(getRequireAccountTypeMiddleWare.bind(null, [AccountType.Admin, AccountType.Mentor]))
  @ResponseSchemaSuccess(
    { type: 'object', propertyType: StudentDetailResponseDto } as IObjectSchema,
    'Return detail information of a student!'
  )
  async asyncGetDetail(@Params() { id }: DetailParams): Promise<StudentDetailResponseDto | undefined> {
    const { logger } = global.applicationContexts;
    logger.info('========== StudentController API asyncGetDetail start');
    try {
      const result = await this.studentService.asyncGetStudent(id);
      logger.info('========== StudentController API asyncGetDetail success ');
      return result;
    } catch (error) {
      logger.error('========== StudentController API asyncGetDetail error :', error);
      throw error;
    }
  }

  @Get(StudentController.children.list, 'Get list students')
  @Middleware(requireSignedInMiddleWare)
  @MiddlewareCustom(getRequireAccountTypeMiddleWare.bind(null, [AccountType.Admin, AccountType.Mentor]))
  @ResponseSchemaSuccess({ type: 'string' } as IStringSchema, 'Return list students!')
  async asyncGetList(@Queries() data: ListQuery): Promise<{ students: StudentBaseResponseDto[]; count: number }> {
    const { logger } = global.applicationContexts;
    logger.info('========== StudentController API asyncGetList start');
    try {
      const result = await this.studentService.asyncListStudent(data);
      logger.info('========== StudentController API asyncGetList success ');
      return result;
    } catch (error) {
      logger.error('========== StudentController API asyncGetList error :', error);
      throw error;
    }
  }

  @Post(StudentController.children.save, 'Create student')
  @Middleware(requireSignedInMiddleWare)
  @MiddlewareCustom(getRequireAccountTypeMiddleWare.bind(null, [AccountType.Admin]))
  @ResponseSchemaSuccess({ type: 'string' } as IStringSchema, 'Create new student!')
  async asyncCreate(@Body() data: SavedStudentRequestDto): Promise<void> {
    const { logger } = global.applicationContexts;
    logger.info('========== StudentController API asyncCreate start');
    logger.debug('========== StudentController API asyncCreate start', data);
    try {
      await this.studentService.asyncSaveStudent(data);
      logger.info('========== StudentController API asyncCreate success ');
    } catch (error) {
      logger.error('========== StudentController API asyncCreate error :', error);
      throw error;
    }
  }

  @Delete(StudentController.children.detail, 'Delete student')
  @Middleware(requireSignedInMiddleWare)
  @MiddlewareCustom(getRequireAccountTypeMiddleWare.bind(null, [AccountType.Admin]))
  @ResponseSchemaSuccess({ type: 'string' } as IStringSchema, 'Delete a student!')
  async asyncDeleteDetail(@Params() { id }: DetailParams): Promise<void> {
    const { logger } = global.applicationContexts;
    logger.info('========== StudentController API asyncGetDetail start', id);
    try {
      await this.studentService.asyncDeleteStudent(id);
      logger.info('========== StudentController API asyncGetDetail success ');
    } catch (error) {
      logger.error('========== StudentController API asyncGetDetail error :', error);
      throw error;
    }
  }
}
