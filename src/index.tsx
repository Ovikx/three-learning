import React from 'react';
import ReactDOM from 'react-dom/client';
import { ModelViewer } from './components/ModelViewer';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <h1>HI HOW ARE YOU</h1>
    <ModelViewer />
  </React.StrictMode>
);
