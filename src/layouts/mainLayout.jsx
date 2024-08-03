import Header from "./header";
import { useDarkMode } from "../Style/DarkModeContext";

export default function MainLayout({ children }) {
  const { isDarkMode } = useDarkMode(); // Get the isDarkMode value from the context

  return (
    // Main container for the entire layout
    <div className={`flex flex-col min-h-[100vh] main-layout ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Header component */}
      <Header />
      {/* Main content area */}
      <div className={`grow p-4 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        {/* Container for centering and limiting width of content */}
        <div className="max-w-[1000px] mx-auto">
          {/* Render the child components passed to MainLayout */}
          {children}
        </div>
      </div>
    </div>
  );
}
