import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { Toaster } from 'sonner';

import './styles.css';

import { routeTree } from './routeTree.gen';

const router = createRouter({ 
  routeTree,
  defaultNotFoundComponent: () => (
    <div style={{ padding: '50px', background: 'red', color: 'white' }}>
      <h1>Erro 404: Rota não encontrada.</h1>
      <p>O Router está a funcionar, mas esta URL não está no routeTree.</p>
    </div>
  )
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <Toaster position="top-right" richColors />
  </React.StrictMode>
);