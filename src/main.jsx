import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Home from "./components/home";
import Contact from "./components/contact";
import About from "./components/about";
import Login from "./components/login";
import Register from "./components/register";
import UploadFile from "./components/uploadFile";
import Table from "./components/table";
import Chart from "./components/chart";
import Plot from "./components/plot";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/uploadFile",
    element: <UploadFile />,
  },
  {
    path: "/table",
    element: <Table />,
  },
  {
    path: "/chart",
    element: <Chart />,
  },
  {
    path: "/plot",
    element: <Plot />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);
