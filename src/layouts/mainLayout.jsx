import Header from "./header";

export default function MainLayout({ children }) {
  return (
    // Main container for the entire layout
    <div className="flex flex-col min-h-[100vh] main-layout">
      {/* Header component */}
      <Header />
      {/* Main content area */}
      <div className="grow p-4 bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
        {/* Container for centering and limiting width of content */}
        <div className="max-w-[1000px] mx-auto ">
          {/* Render the child components passed to MainLayout */}
          {children}
        </div>
      </div>
    </div>
  );
}