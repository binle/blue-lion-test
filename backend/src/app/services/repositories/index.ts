import { AccountEntity, MentorEntity, StudentEntity } from 'src/definitions/entities';
import { Repository } from 'typeorm';

export const getAccountRepository = (): Repository<AccountEntity> => {
  return global.applicationContexts.database.getRepository(AccountEntity);
};

export const getMentorRepository = (): Repository<MentorEntity> =>
  global.applicationContexts.database.getRepository(MentorEntity);

export const getStudentRepository = (): Repository<StudentEntity> =>
  global.applicationContexts.database.getRepository(StudentEntity);
