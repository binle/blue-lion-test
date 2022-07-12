import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { ApplicationContext } from '../../data';
import { AccountType } from '../../definition';

export const LeftNavigationComponent = (props: {
  navigationState: boolean;
  setNavigationState: (value: boolean) => void;
}) => {
  const { accountInfo } = useContext(ApplicationContext);
  const style: any = {};
  if (props.navigationState) {
    style.display = 'flex';
  }
  return (
    <nav
      className="left-nav"
      style={style}
      onClick={() => props.setNavigationState(false)}
    >
      <div>
        {(accountInfo?.accountType === AccountType.Admin ||
          accountInfo?.accountType === AccountType.Student) && (
          <NavLink to="/mentors">Mentors</NavLink>
        )}

        {(accountInfo?.accountType === AccountType.Admin ||
          accountInfo?.accountType === AccountType.Mentor) && (
          <NavLink to="/students">Students</NavLink>
        )}

        {(accountInfo?.accountType === AccountType.Student ||
          accountInfo?.accountType === AccountType.Mentor) && (
          <NavLink to="/profile">Your profile</NavLink>
        )}
      </div>
    </nav>
  );
};
