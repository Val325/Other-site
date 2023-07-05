import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import OnePost from './components/onePagePost.js';
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
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);


