import { HttpStatusCodes, newBinHttpError, Service } from '@bakku/platform';

import {
  AccountPasswordStatus,
  AccountType,
  SavedMentorRequestDto,
  IMentorService,
  ListQuery,
  MentorBaseResponseDto,
  MentorDetailResponseDto,
  SMentorService,
} from 'src/definitions';
import { AccountEntity, MentorEntity } from 'src/definitions/entities';
import { HelperUtil } from '../utils';
import { getAccountRepository, getMentorRepository } from './repositories';

@Service(SMentorService)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class MentorService implements IMentorService {
  async asyncSaveMentor(data: SavedMentorRequestDto): Promise<void> {
    if (data.extra) {
      data.extra = data.extra.filter((item) => item.key || item.value);
    }
    let mentorId = data.mentorId;
    if (!data.mentorId) {
      const accountEntity = await getAccountRepository().findOne({ where: { username: data.signInData.username } });
      if (accountEntity) {
        throw newBinHttpError({
          ...HttpStatusCodes.BAD_GATEWAY,
          code: 'username_exited',
          message: 'username is exist! Please use other username',
        });
      }

      const { password, salt } = HelperUtil.hashPassword(data.signInData.password as string);
      const account = await getAccountRepository().save({
        username: data.signInData.username,
        password,
        salt,
        accountType: AccountType.Mentor,
        passwordStatus: AccountPasswordStatus.NeedChange,
      });
      mentorId = account.id;
    } else {
      const accountEntity = await getAccountRepository().findOne({ where: { id: data.mentorId } });
      if (!accountEntity) {
        throw newBinHttpError({
          ...HttpStatusCodes.BAD_REQUEST,
          code: 'mentor_is_not_exist',
          message: 'Mentor is not exist!',
        });
      }
      if (data.signInData.username && accountEntity.username !== data.signInData.username) {
        const accountEntity = await getAccountRepository().findOne({ where: { username: data.signInData.username } });
        if (accountEntity) {
          throw newBinHttpError({
            ...HttpStatusCodes.BAD_GATEWAY,
            code: 'username_exited',
            message: 'username is exist! Please use other username',
          });
        }
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
    await getMentorRepository().save({
      fullName: data.fullName,
      description: data.description,
      extra: data.extra,
      mentorId,
    });
  }

  async asyncDeleteMentor(id: string): Promise<void> {
    const { database } = global.applicationContexts;
    await database.transaction(async (transaction) => {
      await transaction.delete(MentorEntity, { mentorId: id });
      await transaction.delete(AccountEntity, { id });
    });
  }

  async asyncGetMentor(id: string): Promise<MentorDetailResponseDto | undefined> {
    const mentor = await getMentorRepository().findOne({ where: { mentorId: id }, relations: { account: true } });
    if (!mentor) {
      return undefined;
    }
    return {
      mentorId: mentor.mentorId,
      fullName: mentor.fullName,
      description: mentor.description,
      extra: mentor.extra,
      username: mentor.account?.username as string,
    };
  }
  async asyncListMentor(data: ListQuery): Promise<{ mentors: MentorBaseResponseDto[]; count: number }> {
    const [mentors, count] = await getMentorRepository().findAndCount({
      skip: data.offset || 0,
      take: data.limit || 50,
      order: {
        createdAt: 'ASC',
      },
    });
    return {
      count,
      mentors: (mentors || []).map((mentor) => ({
        mentorId: mentor.mentorId,
        fullName: mentor.fullName,
        description: mentor.description,
        extra: mentor.extra,
      })),
    };
  }
}
