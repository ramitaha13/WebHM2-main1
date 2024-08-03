// src/components/Contact.jsx
import React from "react";
import { useDarkMode } from "./DarkModeContext"; // Import useDarkMode from your context

const Contact = () => {
  const { isDarkMode } = useDarkMode(); // Get the isDarkMode value from the context

  return (
    <div className={`max-w-3xl mx-auto p-10 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
      <h1 className={`text-4xl text-gray-800 text-center mb-8 ${isDarkMode ? 'text-white' : 'text-indigo-600'}`}>
        Contact Information
      </h1>
      <p className={`text-lg text-gray-700 mb-6 leading-relaxed ${isDarkMode ? 'text-gray-300' : ''}`}>
        For inquiries regarding permissions, content quality, or any other
        matter related to this website, please contact us at:
      </p>
      <ul className="list-none p-0 mb-8">
        <li className={`flex items-center mb-4 text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          <span
            className="w-6 h-6 mr-3 bg-contain bg-no-repeat bg-center"
            style={{
              backgroundImage:
                'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%232980b9"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>\')',
            }}
          ></span>
          <strong className={`text-gray-800 font-semibold ${isDarkMode ? 'text-white' : ''}`}>Email:</strong>
          &nbsp;jad.taha@braude.ac.il
        </li>
        <li className={`flex items-center mb-4 text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          <span
            className="w-6 h-6 mr-3 bg-contain bg-no-repeat bg-center"
            style={{
              backgroundImage:
                'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%232980b9"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>\')',
            }}
          ></span>
          <strong className={`text-gray-800 font-semibold ${isDarkMode ? 'text-white' : ''}`}>Phone:</strong>
          &nbsp;+972537377777
        </li>
        <li className={`flex items-center mb-4 text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          <span
            className="w-6 h-6 mr-3 bg-contain bg-no-repeat bg-center"
            style={{
              backgroundImage:
                'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%232980b9"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>\')',
            }}
          ></span>
          <strong className={`text-gray-800 font-semibold ${isDarkMode ? 'text-white' : ''}`}>Address:</strong>
          &nbsp;Tel-Aviv
        </li>
      </ul>
      <p className={`text-lg leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        We value our users and are committed to providing an exceptional
        experience on our website. Thank you for your understanding and
        cooperation.
      </p>
    </div>
  );
};

export default Contact;
