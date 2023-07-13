import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from './pages/home.jsx';
import Dashboard from './pages/dashboard.jsx';
import { Layout } from './components/layout.jsx';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/u',
    element: <Layout />,
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider {...{router}} />
  </React.StrictMode>,
)
