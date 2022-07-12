import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { ApplicationContext } from '../../data';
import { asyncLogout } from '../../services';
import { preventMouseEvent } from '../../utils';

export const HeaderComponent = (props: { toggleMenu: () => void }) => {
  const { accountInfo } = useContext(ApplicationContext);
  return (
    <div className="header">
      <div className="header-navigation">
        <button onClick={preventMouseEvent(props.toggleMenu)}>Menu</button>
      </div>

      <div className="header-content">
        {!!accountInfo?.id && (
          <>
            <div className="header-content-user">{accountInfo.username}</div>
            <button onClick={() => asyncLogout()}>Log out</button>
          </>
        )}
        {!accountInfo?.id && (
          <div className="header-content-user">
            <NavLink to="/login">Login</NavLink>
          </div>
        )}
      </div>
    </div>
  );
};
