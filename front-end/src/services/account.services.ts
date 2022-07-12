import axios from 'axios';
import { JWT_TOKEN } from '../constants';
import { CurrentAccountInfoResponseDto } from '../definition';
import { ENV } from '../initialization';

export const asyncGetCurrentAccountInformation = async (): Promise<
  CurrentAccountInfoResponseDto | undefined
> => {
  const token = window.localStorage.getItem(JWT_TOKEN);
  if (token) {
    const response = await axios.get(
      `${ENV.BACKEND_PREFIX_URL}/api/account/info`
    );
    return response.data;
  }
};

export const asyncLogin = async (
  username: string,
  password: string
): Promise<string | undefined> => {
  try {
    const response = await axios.post(
      `${ENV.BACKEND_PREFIX_URL}/api/account/sign-in`,

      { username, password }
    );
    const token = response.data?.token;
    if (token) {
      window.localStorage.setItem(JWT_TOKEN, token);
    }
  } catch (error: any) {
    return error.response?.data?.error?.message || error.message;
  }
};

export const asyncLogout = async (): Promise<void> => {
  try {
    await axios.post(`${ENV.BACKEND_PREFIX_URL}/api/account/sign-out`);
    window.localStorage.removeItem(JWT_TOKEN);
    window.location.href = '/';
  } catch (error: any) {
    throw error;
  }
};

export const asyncChangePassword = async (
  oldPassword: string,
  newPassword: string
): Promise<void> => {
  return await axios.post(
    `${ENV.BACKEND_PREFIX_URL}/api/account/change-password`,
    {
      oldPassword,
      newPassword,
    }
  );
};
