import { Component } from 'react';
import { toast } from 'react-toastify';
import { asyncLogin } from '../../../services';
import { preventMouseEvent } from '../../../utils';

export class LoginPage extends Component<
  any,
  { username: string; password: string }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
  }

  async onLogin() {
    const message = await asyncLogin(this.state.username, this.state.password);
    if (message) {
      toast.error(`Can not log-in!${message}`);
    } else {
      window.location.href = '/';
    }
  }

  render() {
    return (
      <div className="login-page">
        <h2>Login</h2>
        <form>
          <div className="form-input">
            <div className="form-input-row">
              <label className="input-label">Username</label>
              <input
                className="input-value"
                value={this.state.username}
                onChange={(event) =>
                  this.setState({ username: event.target.value })
                }
              />
            </div>
            <div className="form-input-row">
              <label className="input-label">Password</label>
              <input
                className="input-value"
                type={'password'}
                value={this.state.password}
                onChange={(event) =>
                  this.setState({ password: event.target.value })
                }
              />
            </div>
            <div>
              <button
                className="form-submit"
                onClick={preventMouseEvent(this.onLogin.bind(this))}
              >
                Login
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
