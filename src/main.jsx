import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Home from "./components/home";
import Contact from "./components/contact";
import About from "./components/about";
import UploadFile from "./components/uploadFile";
import CombineFiles from "./components/combineFiles";
import Comparision from "./components/comparision";
import braudeLogo from "./assets/braude_logo.png";
import { DarkModeProvider } from "./Style/DarkModeContext";

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
    path: "/uploadFile",
    element: <UploadFile />,
  },
  {
    path: "/combineFiles",
    element: <CombineFiles />,
  },
  {
    path: "/comparision",
    element: <Comparision />,
  },
]);

// Function to set the favicon
function setFavicon(url) {
  const link = document.createElement("link");
  link.rel = "icon";
  link.href = url;
  document.head.appendChild(link);
}

// Set the favicon when the app loads
setFavicon(braudeLogo);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <DarkModeProvider>
    <RouterProvider router={router} />
  </DarkModeProvider>,
);
