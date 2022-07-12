import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ApplicationContext } from '../../data';
import { AuthenticationData } from '../../definition';
import { HeaderComponent } from './header.component';
import { LeftNavigationComponent } from './left-navigation.component';

export const LayoutComponent = ({ accountInfo }: AuthenticationData) => {
  const [navigationState, setNavigationState] = useState(false);
  return (
    <ApplicationContext.Provider value={{ accountInfo }}>
      <div className="application">
        <HeaderComponent
          toggleMenu={() => setNavigationState(!navigationState)}
        />
        <div className="content">
          {!!accountInfo && (
            <LeftNavigationComponent
              navigationState={navigationState}
              setNavigationState={setNavigationState}
            />
          )}
          <div className="main-content">
            <Outlet />
          </div>
        </div>
      </div>
    </ApplicationContext.Provider>
  );
};
