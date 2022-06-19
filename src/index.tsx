import React from 'react';
import ReactDOM from 'react-dom/client';
import { SkyscraperViewer } from './components/SkyscraperViewer';
import { ModelViewer } from './components/ModelViewer';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <div>
    <h1>three testing</h1>
    <ModelViewer />
  </div>
);
