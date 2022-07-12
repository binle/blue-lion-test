import { HttpStatusCodes, newBinHttpError, Service } from '@bakku/platform';

import {
  AccountPasswordStatus,
  AccountType,
  IStudentService,
  ListQuery,
  SavedStudentRequestDto,
  SStudentService,
  StudentBaseResponseDto,
  StudentDetailResponseDto,
} from 'src/definitions';
import { AccountEntity, StudentEntity } from 'src/definitions/entities';
import { HelperUtil } from '../utils';
import { getAccountRepository, getStudentRepository } from './repositories';

@Service(SStudentService)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class StudentService implements IStudentService {
  async asyncSaveStudent(data: SavedStudentRequestDto): Promise<void> {
    if (data.extra) {
      data.extra = data.extra.filter((item) => item.key || item.value);
    }
    let studentId = data.studentId;
    if (!data.studentId) {
      const { password, salt } = HelperUtil.hashPassword(data.signInData.password as string);
      const account = await getAccountRepository().save({
        username: data.signInData.username,
        password,
        salt,
        accountType: AccountType.Student,
        passwordStatus: AccountPasswordStatus.NeedChange,
      });
      studentId = account.id;
    } else {
      const accountEntity = await getAccountRepository().findOne({ where: { id: data.studentId } });
      if (!accountEntity) {
        throw newBinHttpError({
          ...HttpStatusCodes.BAD_REQUEST,
          code: 'student_is_not_exist',
          message: 'Student is not exist!',
        });
      }
      accountEntity.username = data.signInData.username;
      if (data.signInData.password) {
        const { password, salt } = HelperUtil.hashPassword(data.signInData.password as string);
        accountEntity.password = password;
        accountEntity.salt = salt;
        accountEntity.passwordStatus = AccountPasswordStatus.NeedChange;
      }
      await getAccountRepository().save(accountEntity);
    }
    await getStudentRepository().save({
      fullName: data.fullName,
      description: data.description,
      extra: data.extra,
      studentId,
    });
  }

  async asyncDeleteStudent(id: string): Promise<void> {
    const { database } = global.applicationContexts;
    await database.transaction(async (transaction) => {
      await transaction.delete<StudentEntity>(StudentEntity, { studentId: id });
      await transaction.delete(AccountEntity, { id });
    });
  }

  async asyncGetStudent(id: string): Promise<StudentDetailResponseDto | undefined> {
    const student = await getStudentRepository().findOne({ where: { studentId: id }, relations: { account: true } });
    if (!student) {
      return undefined;
    }
    return {
      studentId: student.studentId,
      fullName: student.fullName,
      description: student.description,
      extra: student.extra,
      username: student.account?.username as string,
    };
  }

  async asyncListStudent(data: ListQuery): Promise<{ students: StudentBaseResponseDto[]; count: number }> {
    const [students, count] = await getStudentRepository().findAndCount({
      skip: data.offset || 0,
      take: data.limit || 50,
    });
    return {
      count,
      students: (students || []).map((student) => ({
        studentId: student.studentId,
        fullName: student.fullName,
        description: student.description,
        extra: student.extra,
      })),
    };
  }
}
