import axios from 'axios';
import { listItemPerPage } from '../constants';
import {
  ExtraInfo,
  StudentBaseResponseDto,
  StudentDetailResponseDto,
} from '../definition';
import { ENV } from '../initialization';

export const asyncGetStudents = async (
  offset: number
): Promise<{
  students: StudentBaseResponseDto[];
  count: number;
}> => {
  const response = await axios.get(
    `${ENV.BACKEND_PREFIX_URL}/api/student/list?offset=${offset}&limit=${listItemPerPage}`
  );
  return { students: response.data.students, count: response.data.count };
};

export const asyncGetStudentDetail = async (
  id: string
): Promise<StudentDetailResponseDto | undefined> => {
  const response = await axios.get(
    `${ENV.BACKEND_PREFIX_URL}/api/student/detail/${id}`
  );
  return response.data;
};

export const asyncSaveStudent = async (data: {
  studentId?: string;
  username: string;
  password: string;
  fullName: string;
  description: string;
  extra?: ExtraInfo[];
}): Promise<void> => {
  return await axios.post(`${ENV.BACKEND_PREFIX_URL}/api/student`, {
    studentId: data.studentId,
    fullName: data.fullName,
    description: data.description,
    extra: data.extra,
    signInData: {
      username: data.username,
      password: data.password,
    },
  });
};

export const asyncDeleteStudent = async (id: string): Promise<void> => {
  return await axios.delete(
    `${ENV.BACKEND_PREFIX_URL}/api/student/detail/${id}`
  );
};
