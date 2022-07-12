import { useEffect, useState } from 'react';
import { APP_EVENTS } from '../../constants';
import { appEventEmitter } from '../../initialization';
import { OverlayComponent } from './overlay.component';

export const LoadingComponent = () => {
  const [displayOverlay, setDisplayOverlay] = useState(false);

  useEffect(() => {
    appEventEmitter.on(APP_EVENTS.app_loading, (value: boolean) =>
      setDisplayOverlay(value)
    );
  }, []);

  return (
    <OverlayComponent display={displayOverlay}>Processing....</OverlayComponent>
  );
};
