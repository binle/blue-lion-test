import axios from 'axios';
import { listItemPerPage } from '../constants';
import {
  ExtraInfo,
  MentorBaseResponseDto,
  MentorDetailResponseDto,
} from '../definition';
import { ENV } from '../initialization';

export const asyncGetMentors = async (
  offset: number
): Promise<{
  mentors: MentorBaseResponseDto[];
  count: number;
}> => {
  const response = await axios.get(
    `${ENV.BACKEND_PREFIX_URL}/api/mentor/list?offset=${offset}&limit=${listItemPerPage}`
  );
  return { mentors: response.data.mentors, count: response.data.count };
};

export const asyncGetMentorDetail = async (
  id: string
): Promise<MentorDetailResponseDto | undefined> => {
  const response = await axios.get(
    `${ENV.BACKEND_PREFIX_URL}/api/mentor/detail/${id}`
  );
  return response.data;
};

export const asyncSaveMentor = async (data: {
  mentorId?: string;
  username: string;
  password: string;
  fullName: string;
  description: string;
  extra?: ExtraInfo[];
}): Promise<void> => {
  return await axios.post(`${ENV.BACKEND_PREFIX_URL}/api/mentor`, {
    mentorId: data.mentorId,
    fullName: data.fullName,
    description: data.description,
    extra: data.extra,
    signInData: {
      username: data.username,
      password: data.password,
    },
  });
};

export const asyncDeleteMentor = async (id: string): Promise<void> => {
  return await axios.delete(
    `${ENV.BACKEND_PREFIX_URL}/api/mentor/detail/${id}`
  );
};
