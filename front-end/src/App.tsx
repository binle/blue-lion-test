import { Component, ReactNode, StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AccountPasswordStatus, AuthenticationData } from './definition';
import { AppRouter } from './views';

import './App.scss';
import 'react-toastify/dist/ReactToastify.css';
import { LoadingComponent } from './views/components/loading.component';
import { ChangePasswordModal } from './views/components/change-password.component';

export class Application extends Component<AuthenticationData> {
  render(): ReactNode {
    return (
      <StrictMode>
        <BrowserRouter>
          <AppRouter accountInfo={this.props.accountInfo} />
        </BrowserRouter>
        <ToastContainer />
        {this.props.accountInfo?.passwordStatus ===
          AccountPasswordStatus.NeedChange && <ChangePasswordModal />}
        <LoadingComponent />
      </StrictMode>
    );
  }
}
