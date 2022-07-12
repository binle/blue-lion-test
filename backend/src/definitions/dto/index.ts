import { DataEnumProperty, DataProperty, DataPropertyOptional, getEnumValues } from '@bakku/core';
import { IArraySchema, INumberSchema } from '@bakku/platform';
import { AccountPasswordStatus, AccountType } from '../common';

export class SignInRequestBodyDto {
  @DataProperty()
  username: string;

  @DataProperty()
  password: string;
}

export class AccountBodyDto {
  @DataProperty()
  username: string;

  @DataProperty()
  password?: string;
}

export class SignInResponseDto {
  @DataProperty()
  token: string;
}

export class ExtraInfo {
  @DataProperty()
  key: string;

  @DataProperty()
  value: string;
}

export class MentorBaseResponseDto {
  @DataPropertyOptional()
  mentorId: string;

  @DataProperty()
  fullName: string;

  @DataPropertyOptional()
  description?: string;

  @DataPropertyOptional({
    type: 'array',
    itemSchema: { propertyType: ExtraInfo },
  } as IArraySchema)
  extra?: ExtraInfo[];
}

export class MentorDetailResponseDto {
  @DataPropertyOptional()
  mentorId: string;

  @DataProperty()
  fullName: string;

  @DataPropertyOptional()
  description?: string;

  @DataPropertyOptional({
    type: 'array',
    itemSchema: { propertyType: ExtraInfo },
  } as IArraySchema)
  extra?: ExtraInfo[];
  @DataProperty()
  username: string;
}

export class SavedMentorRequestDto {
  @DataPropertyOptional()
  mentorId: string;

  @DataProperty()
  fullName: string;

  @DataPropertyOptional()
  description?: string;

  @DataPropertyOptional({
    type: 'array',
    itemSchema: { propertyType: ExtraInfo },
  } as IArraySchema)
  extra?: ExtraInfo[];

  @DataProperty({
    type: 'object',
    propertyType: AccountBodyDto,
  })
  signInData: AccountBodyDto;
}

export class StudentBaseResponseDto {
  @DataPropertyOptional()
  studentId: string;

  @DataProperty()
  fullName: string;

  @DataPropertyOptional()
  description?: string;

  @DataPropertyOptional({
    type: 'array',
    itemSchema: { propertyType: ExtraInfo },
  } as IArraySchema)
  extra?: ExtraInfo[];
}

export class StudentDetailResponseDto {
  @DataPropertyOptional()
  studentId?: string;

  @DataProperty()
  fullName: string;

  @DataPropertyOptional()
  description?: string;

  @DataPropertyOptional({
    type: 'array',
    itemSchema: { propertyType: ExtraInfo },
  } as IArraySchema)
  extra?: ExtraInfo[];

  @DataProperty()
  username: string;
}

export class SavedStudentRequestDto {
  @DataPropertyOptional()
  studentId?: string;

  @DataProperty()
  fullName: string;

  @DataPropertyOptional()
  description?: string;

  @DataPropertyOptional({
    type: 'array',
    itemSchema: { propertyType: ExtraInfo },
  } as IArraySchema)
  extra?: ExtraInfo[];
  @DataProperty({ type: 'object', propertyType: AccountBodyDto })
  signInData: AccountBodyDto;
}

export class CurrentAccountInfoResponseDto {
  @DataProperty()
  id: string;

  @DataProperty()
  username: string;

  @DataEnumProperty({ enumValues: getEnumValues(AccountPasswordStatus) })
  passwordStatus: AccountPasswordStatus;

  @DataEnumProperty({ enumValues: getEnumValues(AccountType) })
  accountType: AccountType;

  @DataProperty({ type: 'object', propertyType: MentorBaseResponseDto })
  mentorInfo?: MentorBaseResponseDto;

  @DataProperty({ type: 'object', propertyType: StudentBaseResponseDto })
  studentInfo?: StudentBaseResponseDto;
}

export class ChangePasswordBodyDto {
  @DataProperty()
  oldPassword: string;

  @DataProperty()
  newPassword: string;
}

export class ResetPasswordBodyDto {
  @DataProperty()
  id: string;

  @DataProperty()
  newPassword: string;
}

export class ListQuery {
  @DataPropertyOptional({ description: 'default = 0', type: 'number', validation: { min: 0 } } as INumberSchema)
  offset?: number;

  @DataPropertyOptional({
    description: 'value <=100 default = 50',
    type: 'number',
    validation: { max: 100, min: 1 },
  } as INumberSchema)
  limit?: number;
}

export class DetailParams {
  @DataProperty()
  id: string;
}
