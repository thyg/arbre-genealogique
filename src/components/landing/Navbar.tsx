// src/components/landing/Navbar.tsx
'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { FaTree, FaBars, FaTimes, FaUserPlus, FaSignInAlt } from 'react-icons/fa';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Fonctionnalités', href: '#features' },
    { name: 'Exemples', href: '#examples' },
    { name: 'Tarifs', href: '#pricing' },
    { name: 'À propos', href: '#about' },
  ];

  return (
    <header className={`fixed w-full z-50 transition-all ${scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <FaTree className="text-blue-600 text-2xl" />
            <span className="text-xl font-bold text-gray-800">GeneaTree</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`font-medium transition ${pathname === item.href ? 'text-blue-600' : 'text-gray-700 hover:text-blue-500'}`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/authentification/login" className="flex items-center space-x-1 text-gray-700 hover:text-blue-500">
              <FaSignInAlt />
              <span>Connexion</span>
            </Link>
            <Link href="/authentification/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-1 transition">
              <FaUserPlus />
              <span>S'inscrire</span>
            </Link>
            <Link
              href="/collaboration/invitation"
              className="block text-center py-2 bg-blue-700 text-white rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              Invitation
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white mt-4 py-4 rounded-lg shadow-xl">
            <nav className="flex flex-col space-y-4 px-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`font-medium py-2 ${pathname === item.href ? 'text-blue-600' : 'text-gray-700'}`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <Link
                  href="/login"
                  className="block text-center py-2 text-gray-700 border border-gray-300 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Connexion
                </Link>
                <Link
                  href="/authentification/"
                  className="block text-center py-2 bg-blue-600 text-white rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  S'inscrire
                </Link>
                
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}