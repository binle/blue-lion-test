import {
  ChangePasswordBodyDto,
  SavedMentorRequestDto,
  SavedStudentRequestDto,
  ListQuery,
  MentorBaseResponseDto,
  MentorDetailResponseDto,
  ResetPasswordBodyDto,
  SignInRequestBodyDto,
  SignInResponseDto,
  StudentBaseResponseDto,
  StudentDetailResponseDto,
} from '../dto';
import { AccountEntity } from '../entities';

export interface AuthenticatedAccountInfo {
  account?: AccountEntity;
  token?: string;
}

export const SAccountService = Symbol('AccountService');

export interface IAccountService {
  asyncSignIn(data: SignInRequestBodyDto): Promise<SignInResponseDto>;
  asyncSignOut(token: string): Promise<void>;
  asyncDetectAccountFromToken(token: string, includeDetail?: boolean): Promise<AuthenticatedAccountInfo>;
  asyncChangePassword(account: AccountEntity, data: ChangePasswordBodyDto): Promise<void>;
  asyncResetPassword(data: ResetPasswordBodyDto): Promise<void>;
}

export const SMentorService = Symbol('MentorService');

export interface IMentorService {
  asyncSaveMentor(data: SavedMentorRequestDto): Promise<void>;
  asyncDeleteMentor(id: string): Promise<void>;
  asyncGetMentor(id: string): Promise<MentorDetailResponseDto | undefined>;
  asyncListMentor(data: ListQuery): Promise<{ mentors: MentorBaseResponseDto[]; count: number }>;
}

export const SStudentService = Symbol('StudentService');

export interface IStudentService {
  asyncSaveStudent(data: SavedStudentRequestDto): Promise<void>;
  asyncDeleteStudent(id: string): Promise<void>;
  asyncGetStudent(id: string): Promise<StudentDetailResponseDto | undefined>;
  asyncListStudent(data: ListQuery): Promise<{ students: StudentBaseResponseDto[]; count: number }>;
}
