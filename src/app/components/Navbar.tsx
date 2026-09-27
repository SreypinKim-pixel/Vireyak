"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import {
  SunIcon,
  MoonIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Stays", href: "/stays" },
  { name: "Attraction", href: "/attraction" },
  { name: "About", href: "/about" },
];

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Use resolvedTheme to accurately detect active theme (light/dark) even if set to 'system'
  const { theme, setTheme, resolvedTheme } = useTheme();

  // Ensure component is mounted on client before rendering theme toggle UI
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-lg relative z-50 transition-colors duration-300">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-indigo-800 dark:text-white transition-colors duration-300"
        >
          Vireyak
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex space-x-6">
          {navItems.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <Link
                href={item.href}
                className="relative text-gray-700 dark:text-gray-200 hover:text-indigo-800 dark:hover:text-white transition-colors duration-300 group py-1"
              >
                {item.name}
                {/* Animated underline effect */}
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-current scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-right group-hover:origin-left" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Desktop Controls (Dark Mode Toggle, Sign Up & Register) */}
        <div className="hidden md:flex items-center space-x-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-colors duration-300"
            aria-label="Toggle dark mode"
          >
            {mounted ? (
              resolvedTheme === "dark" ? (
                <SunIcon className="h-6 w-6 text-yellow-400" />
              ) : (
                <MoonIcon className="h-6 w-6 text-gray-700" />
              )
            ) : (
              <div className="w-6 h-6" /> // Placeholder while unmounted
            )}
          </button>

          <Link
            href="/signup"
            className="text-gray-700 dark:text-gray-200 hover:text-indigo-800 dark:hover:text-white px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:border-indigo-800 dark:hover:border-indigo-400 transition-colors duration-300"
          >
            Sign Up
          </Link>

          <Link
            href="/register"
            className="bg-indigo-800 hover:bg-indigo-900 text-white px-4 py-2 rounded-lg transition-colors duration-300"
          >
            Register
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center space-x-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-colors duration-300"
            aria-label="Toggle dark mode"
          >
            {mounted ? (
              resolvedTheme === "dark" ? (
                <SunIcon className="h-6 w-6 text-yellow-400" />
              ) : (
                <MoonIcon className="h-6 w-6 text-gray-700" />
              )
            ) : (
              <div className="w-6 h-6" />
            )}
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:text-indigo-800 dark:hover:text-white focus:outline-none transition-colors duration-300"
            aria-label="Toggle mobile menu"
          >
            {isOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Animated Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-white dark:bg-gray-800 shadow-lg border-t border-gray-100 dark:border-gray-700"
          >
            <div className="container mx-auto px-4 py-4 space-y-4 flex flex-col">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-gray-700 dark:text-gray-200 hover:text-indigo-800 dark:hover:text-white transition-colors duration-300"
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex space-x-3 pt-2">
                <Link
                  href="/signup"
                  onClick={() => setIsOpen(false)}
                  className="text-center text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg transition-colors duration-300 flex-1"
                >
                  Sign Up
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="text-center bg-indigo-800 text-white px-4 py-2 rounded-lg hover:bg-indigo-900 transition-colors duration-300 flex-1"
                >
                  Register
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
