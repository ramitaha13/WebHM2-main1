import React, { useState } from "react";
import logo from "../assets/braude_logo.png";
import { IonIcon } from "@ionic/react";
import {
  menuOutline,
  closeOutline,
  moonOutline,
  sunnyOutline,
} from "ionicons/icons";
import { Link, useLocation } from "react-router-dom";
import { useDarkMode } from "../Style/DarkModeContext";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} border-gray-200`}>
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <div className="flex items-center">
          <button
            onClick={toggleMenu}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 mr-2"
            aria-controls="mobile-menu"
            aria-expanded={isMenuOpen}
          >
            <IonIcon
              icon={isMenuOpen ? closeOutline : menuOutline}
              style={{ fontSize: "24px" }}
            />
          </button>
          <img
            className="h-6 sm:h-8 md:h-10 lg:h-12 xl:h-14 mr-3"
            src={logo}
            alt="logo"
          />
          <span className={`self-center text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold whitespace-nowrap ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Braude Analyzer
          </span>
        </div>
        <div className="flex items-center md:order-2">
          <button
            onClick={toggleDarkMode}
            className="text-gray-500 hover:bg-gray-100 rounded-lg text-sm p-2.5 me-2"
            aria-label="Toggle dark mode"
          >
            <IonIcon
              icon={isDarkMode ? sunnyOutline : moonOutline}
              className="text-3xl"
              style={{ fontSize: "24px" }}
            />
          </button>
        </div>
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } items-center justify-between w-full md:flex md:w-auto md:order-1`}
          id="mobile-menu"
        >
          <ul className={`flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 ${isDarkMode ? 'md:bg-gray-900' : 'md:bg-white'} ${isDarkMode ? 'dark:border-gray-700' : ''}`}>
            <li>
              <Link
                to="/home"
                className={`block py-2 px-3 rounded hover:bg-gray-100 md:hover:bg-transparent md:p-0 ${location.pathname === "/home" ? "text-blue-700" : isDarkMode ? 'text-white' : 'text-gray-900'}`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/uploadFile"
                className={`block py-2 px-3 rounded hover:bg-gray-100 md:hover:bg-transparent md:p-0 ${location.pathname === "/uploadFile" ? "text-blue-700" : isDarkMode ? 'text-white' : 'text-gray-900'}`}
              >
                Upload File
              </Link>
            </li>
            <li>
              <Link
                to="/combineFiles"
                className={`block py-2 px-3 rounded hover:bg-gray-100 md:hover:bg-transparent md:p-0 ${location.pathname === "/combineFiles" ? "text-blue-700" : isDarkMode ? 'text-white' : 'text-gray-900'}`}
              >
                Combine Files
              </Link>
            </li>
            <li>
              <Link
                to="/comparision"
                className={`block py-2 px-3 rounded hover:bg-gray-100 md:hover:bg-transparent md:p-0 ${location.pathname === "/comparision" ? "text-blue-700" : isDarkMode ? 'text-white' : 'text-gray-900'}`}
              >
                Comparision
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className={`block py-2 px-3 rounded hover:bg-gray-100 md:hover:bg-transparent md:p-0 ${location.pathname === "/about" ? "text-blue-700" : isDarkMode ? 'text-white' : 'text-gray-900'}`}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className={`block py-2 px-3 rounded hover:bg-gray-100 md:hover:bg-transparent md:p-0 ${location.pathname === "/contact" ? "text-blue-700" : isDarkMode ? 'text-white' : 'text-gray-900'}`}
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
