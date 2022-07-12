import { PropsWithChildren } from 'react';

export const OverlayComponent = (
  props: PropsWithChildren & { display: boolean }
) => {
  const style: any = {};
  if (props.display) {
    style.display = 'block';
  }
  return (
    <div className="overlay" style={style}>
      {props.children}
    </div>
  );
};
