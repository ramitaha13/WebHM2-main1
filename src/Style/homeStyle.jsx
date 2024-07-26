// src/Style/HomeStyle.jsx
import React from "react";
import { Link } from "react-router-dom";

const HomeStyle = ({ children }) => (
  <div className="flex flex-col lg:flex-row items-center justify-between mt-4 sm:mt-8 md:mt-12">
    {children}
  </div>
);

export const TextContent = ({ children }) => (
  <div className="text-black dark:text-white lg:max-w-xl">{children}</div>
);

export const MainTitle = ({ children }) => (
  <h1 className="text-blue-800 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight sm:leading-normal">
    {children}
  </h1>
);

export const SubTitle = ({ children }) => (
  <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold mt-2 sm:mt-3 md:mt-5">
    {children}
  </h3>
);

export const Paragraph = ({ children }) => (
  <p className="text-sm sm:text-base mt-2 sm:mt-3 md:mt-5">{children}</p>
);

export const ButtonContainer = ({ children }) => (
  <div className="mt-4 sm:mt-6 md:mt-10">{children}</div>
);

export const StartButton = ({ to, children }) => (
  <Link
    to={to}
    className="bg-green-500 text-white rounded-full py-2 px-4 sm:py-3 sm:px-8 text-sm sm:text-base font-medium inline-block mr-4 hover:bg-green-600 hover:border-green-600 duration-300 dark:bg-green-600 dark:hover:bg-green-700"
  >
    {children}
  </Link>
);

export const HomeImage = ({ src, alt }) => (
  <img
    className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 mt-4 lg:mt-0"
    src={src}
    alt={alt}
  />
);

export default HomeStyle;
