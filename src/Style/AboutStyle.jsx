// src/Style/AboutStyle.jsx
import React from "react";
import { useDarkMode } from "./DarkModeContext"; // Import useDarkMode from your context

const AboutStyle = ({ children }) => {
  const { isDarkMode } = useDarkMode(); // Get the isDarkMode value from the context

  return (
    <div className={`container mx-auto px-4 py-8 max-w-3xl ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <h1 className={`text-4xl font-bold mb-6 pb-2 border-b-2 ${isDarkMode ? 'border-blue-500 text-white' : 'border-blue-500 text-blue-800'}`}>
        Website Policy
      </h1>
      {children}
    </div>
  );
};

export const SectionTitle = ({ children }) => {
  const { isDarkMode } = useDarkMode(); // Get the isDarkMode value from the context

  return (
    <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
      {children}
    </h2>
  );
};

export const Paragraph = ({ children }) => (
  <p className="mb-4">{children}</p>
);

export const List = ({ children }) => (
  <ul className="list-disc pl-5 mb-4">{children}</ul>
);

export const ListItem = ({ children }) => (
  <li className="mb-2">{children}</li>
);

export const Section = ({ children }) => (
  <section className="mb-8">{children}</section>
);

export default AboutStyle;
