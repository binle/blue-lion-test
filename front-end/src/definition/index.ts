export enum AccountPasswordStatus {
  Changed = 'Changed',
  NeedChange = 'Need-change',
}

export enum AccountType {
  Admin = 'Admin',
  Mentor = 'Mentor',
  Student = 'Student',
}

export interface ExtraInfo {
  key: string;

  value: string;
}

export interface MentorBaseResponseDto {
  mentorId: string;

  fullName: string;

  description?: string;

  extra?: ExtraInfo[];
}

export interface StudentBaseResponseDto {
  studentId: string;

  fullName: string;

  description?: string;

  extra?: ExtraInfo[];
}

export interface ItemDetailResponseDto {
  fullName: string;

  description?: string;

  extra?: ExtraInfo[];
  username: string;
}

export interface MentorDetailResponseDto extends ItemDetailResponseDto {
  mentorId: string;
}

export interface StudentDetailResponseDto extends ItemDetailResponseDto {
  studentId: string;
}

export interface CurrentAccountInfoResponseDto {
  id: string;

  username: string;

  passwordStatus: AccountPasswordStatus;

  accountType: AccountType;

  mentorInfo?: MentorBaseResponseDto;

  studentInfo?: StudentBaseResponseDto;
}

export interface AuthenticationData {
  accountInfo?: CurrentAccountInfoResponseDto;
}
