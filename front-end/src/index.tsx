import React from 'react';
import ReactDOM from 'react-dom/client';
import { Application } from './App';
import './index.css';
import { initialization } from './initialization';
import reportWebVitals from './reportWebVitals';
import { ErrorPage } from './views';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

initialization()
  .then((accountInfo) => {
    root.render(
      <React.StrictMode>
        <Application accountInfo={accountInfo} />
      </React.StrictMode>
    );
  })
  .catch((error) => {
    root.render(
      <React.StrictMode>
        <ErrorPage />
      </React.StrictMode>
    );
  });

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
