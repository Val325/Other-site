import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import OnePost from './components/onePagePost.js';
import Registration from './components/registration.js'
import Login from './components/login.js'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "post/:postId",
    element: <OnePost />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/registration",
    element: <Registration />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);


