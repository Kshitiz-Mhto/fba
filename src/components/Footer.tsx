import React from 'react';
import { FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-50 border-t border-neutral-200 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6">

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">

          {/* Brand Column */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-3">
              <img
                src="/assets/craft_logo.png"
                alt="Logo"
                className="w-12 h-12 rounded-xl object-contain"
              />
              <span className="text-3xl font-bold tracking-tight text-neutral-900">
                CrafT
              </span>
            </div>
            <p className="text-sm text-neutral-500 max-w-xs leading-relaxed mb-4">
              Forms that feel like conversation
            </p>
            <div className="flex gap-3 mt-2">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-white border border-neutral-200 rounded-lg flex items-center justify-center text-neutral-600 hover:border-brand-600 hover:text-brand-600 transition-all"
              >
                <FaTwitter size={16} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-white border border-neutral-200 rounded-lg flex items-center justify-center text-neutral-600 hover:border-brand-600 hover:text-brand-600 transition-all"
              >
                <FaLinkedin size={16} />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-white border border-neutral-200 rounded-lg flex items-center justify-center text-neutral-600 hover:border-brand-600 hover:text-brand-600 transition-all"
              >
                <FaGithub size={16} />
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-neutral-900 mb-5">
              Product
            </h4>
            <ul className="space-y-3 text-sm text-neutral-600">
              <li><a href="#" className="hover:text-brand-600 transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-brand-600 transition-colors">Templates</a></li>
              <li><a href="#" className="hover:text-brand-600 transition-colors">Integrations</a></li>
              <li><a href="#" className="hover:text-brand-600 transition-colors">Changelog</a></li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-neutral-900 mb-5">
              Company
            </h4>
            <ul className="space-y-3 text-sm text-neutral-600">
              <li><a href="#" className="hover:text-brand-600 transition-colors">About</a></li>
              <li><a href="#" className="hover:text-brand-600 transition-colors">Customers</a></li>
              <li><a href="#" className="hover:text-brand-600 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-neutral-900 mb-5">
              Legal
            </h4>
            <ul className="space-y-3 text-sm text-neutral-600">
              <li><a href="/privacy" className="hover:text-brand-600 transition-colors">Privacy</a></li>
              <li><a href="/terms" className="hover:text-brand-600 transition-colors">Terms</a></li>
              <li><a href="/security" className="hover:text-brand-600 transition-colors">Security</a></li>
            </ul>
          </div>

        </div>

        {/* Newsletter Subscribe Card */}
        <div className="py-6 px-6 md:px-10 bg-white border border-neutral-200 rounded-2xl mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-md">
              <h5 className="font-bold text-neutral-900 mb-2 text-lg tracking-tight">
                Subscribe to our newsletter
              </h5>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Stay in the loop. Tips, updates, and best practices for building forms that convert.
              </p>
            </div>
            <div className="flex w-full md:w-auto md:min-w-[300px] items-center gap-2 bg-neutral-100 border border-neutral-200 rounded-xl px-2 py-2 focus-within:border-brand-600 focus-within:ring-4 focus-within:ring-brand-100 transition-all">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-transparent px-3 py-2 text-sm text-neutral-700 placeholder-neutral-400 outline-none border-none focus:outline-none focus:ring-0"
              />
              <button className="bg-brand-600 text-white px-6 py-2.5 rounded-lg text-xs font-bold hover:bg-brand-700 transition-all active:scale-95 shadow-sm">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Footer Row */}
        <div className="pt-8 border-t border-neutral-200 flex flex-col md:flex-row justify-between items-center text-xs text-neutral-400 gap-4">
          <div className="flex items-center text-neutral-500">
            <span>© {currentYear} CrafT Inc. All rights reserved.</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-neutral-500">
            <a href="/privacy" className="hover:text-brand-600 transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="/terms" className="hover:text-brand-600 transition-colors">Terms of Service</a>
            <span>•</span>
            <a href="/cookies" className="hover:text-brand-600 transition-colors">Cookie Policy</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
