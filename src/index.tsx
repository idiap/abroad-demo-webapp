// SPDX-FileCopyrightText: 2025 Idiap Research Institute <contact@idiap.ch>
//
// SPDX-FileContributor: Delmas Maxime maxime.delmas@idiap.ch
// SPDX-FileContributor: Gusicuma Danilo danilo.gusicuma@idiap.ch
//
// SPDX-License-Identifier: GPL-3.0-or-later

import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LiteratureAndChemicalsPage from './pages/LiteratureAndChemicals';
import LiteraturePage from './pages/LiteraturePage';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '/literature-chemicals/:orgId',
    element: <LiteratureAndChemicalsPage />
  },
  {
    path: '/literature/:pmid',
    element: <LiteraturePage />
  }
])

root.render(
  <RouterProvider router={router} />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
