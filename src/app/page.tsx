
export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-indigo-900 dark:text-white mb-4 transition-colors duration-300">
        Welcome to Our Website
      </h1>
      <p className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
        This is the main content area. Clicking the theme toggle in your Navbar will now seamlessly switch colors across the whole app.
      </p>
    </div>
  );
}

