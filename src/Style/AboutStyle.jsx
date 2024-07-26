// src/Style/AboutStyle.jsx
import React from "react";

const AboutStyle = ({ children }) => (
  <div className="container mx-auto px-4 py-8 max-w-3xl">
    <h1 className="text-4xl font-bold text-blue-800 mb-6 pb-2 border-b-2 border-blue-500">
      Website Policy
    </h1>
    {children}
  </div>
);

export const SectionTitle = ({ children }) => (
  <h2 className="text-2xl font-semibold text-blue-700 mb-4">{children}</h2>
);

export const Paragraph = ({ children }) => <p className="mb-4">{children}</p>;

export const List = ({ children }) => (
  <ul className="list-disc pl-5 mb-4">{children}</ul>
);

export const ListItem = ({ children }) => <li className="mb-2">{children}</li>;

export const Section = ({ children }) => (
  <section className="mb-8">{children}</section>
);

export default AboutStyle;
