import { Component, PropsWithChildren, ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthenticationData } from '../definition';
import { LayoutComponent } from './components';
import {
  EmptyPage,
  LoginPage,
  MentorsPage,
  NotFoundPage,
  ProfilePage,
  StudentsPage,
} from './pages';

export class ProtectedRoute extends Component<
  AuthenticationData & PropsWithChildren
> {
  render(): ReactNode {
    if (!this.props.accountInfo) {
      // user is not authenticated
      return <Navigate to="/" />;
    }
    return this.props.children;
  }
}

export const AppRouter = ({ accountInfo }: AuthenticationData) => (
  <Routes>
    <Route element={<LayoutComponent accountInfo={accountInfo} />}>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute accountInfo={accountInfo}>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mentors"
        element={
          <ProtectedRoute accountInfo={accountInfo}>
            <MentorsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/students"
        element={
          <ProtectedRoute accountInfo={accountInfo}>
            <StudentsPage />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<EmptyPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  </Routes>
);
