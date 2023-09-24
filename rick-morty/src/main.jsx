import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/home.jsx";
import All from "./pages/all-characters"
import Single from "./pages/single-character"
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/all",
    element: <All />,
  },
  {
    path: "/u/:character",
    element: <Single />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider {...{ router }} />
  </React.StrictMode>
);
