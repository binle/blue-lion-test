import { useState } from 'react';
import { toast } from 'react-toastify';
import { JWT_TOKEN } from '../../constants';
import { AuthenticationData } from '../../definition';
import { asyncChangePassword } from '../../services';
import { preventMouseEvent } from '../../utils';
import { OverlayComponent } from './overlay.component';

export const ChangePasswordComponent = (props: {
  onChangePassword: (oldPassword: string, newPassword: string) => void;
}) => {
  const [passwords, setPassword] = useState({
    oldPassword: '',
    newPassword: '',
  });

  return (
    <div className="change-password">
      <div className="change-password-content">
        <form>
          <h4>Your password need to be changed!</h4>

          <div className="form-input">
            <div className="form-input-row">
              <label className="input-label">Old password</label>
              <input
                className="input-value"
                type={'password'}
                value={passwords.oldPassword}
                onChange={(event) =>
                  setPassword({ ...passwords, oldPassword: event.target.value })
                }
              />
            </div>
            <div className="form-input-row">
              <label className="input-label">Password</label>
              <input
                className="input-value"
                type={'password'}
                value={passwords.newPassword}
                onChange={(event) =>
                  setPassword({ ...passwords, newPassword: event.target.value })
                }
              />
            </div>
            <div>
              <button
                className="form-submit"
                onClick={preventMouseEvent(
                  props.onChangePassword.bind(
                    null,
                    passwords.oldPassword,
                    passwords.newPassword
                  )
                )}
              >
                Change password
              </button>
            </div>
            <p>After changed, please login again!</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export const ChangePasswordModal = (props: AuthenticationData) => {
  const onChangePassword = (oldPassword: string, newPassword: string) => {
    asyncChangePassword(oldPassword, newPassword)
      .then(() => {
        window.localStorage.removeItem(JWT_TOKEN);
        window.location.href = '/login';
      })
      .catch((error) => {
        toast.error(
          `Can not get mentors!${
            error.response?.data?.error?.message || error.message
          }`
        );
      });
  };

  return (
    <OverlayComponent display={true}>
      <ChangePasswordComponent onChangePassword={onChangePassword} />
    </OverlayComponent>
  );
};
