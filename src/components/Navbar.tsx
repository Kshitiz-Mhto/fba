import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/Button';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when location changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Don't show navbar on login/signup pages if desired, 
  // but for now we'll keep it and just adjust links

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || isMobileMenuOpen
        ? 'bg-white/20 backdrop-blur-md py-3'
        : 'bg-transparent border-transparent py-5'
        }`}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img
              src="/assets/craft_logo.png"
              alt="Logo"
              className="w-12 h-12 rounded-xl object-contain"
            />
            <span className="text-3xl font-bold tracking-tight text-neutral-900">
              CrafT
            </span>
          </Link>


          {/* Right Side Actions (Desktop) */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">Pricing</a>
            <Link to="/login" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">Login</Link>
            <Link to="/signup">
              <Button size="sm">Create a form</Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-neutral-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pt-4 pb-6 space-y-4 border-t border-neutral-100 mt-4">
            <a
              href="#"
              className="block text-base font-medium text-neutral-600 hover:text-neutral-900"
            >
              Pricing
            </a>
            <Link
              to="/login"
              className="block text-base font-medium text-neutral-600 hover:text-neutral-900"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="block text-base font-medium text-neutral-600 hover:text-neutral-900"
            >
              Sign up
            </Link>
            <div className="pt-2">
              <Link to="/signup">
                <Button fullWidth>
                  Create a form
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
