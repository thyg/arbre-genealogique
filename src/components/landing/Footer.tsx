// src/components/landing/Footer.tsx
import Link from 'next/link';
import { FaTree, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';

const footerLinks = [
  {
    title: "Produit",
    links: [
      { name: "Fonctionnalités", href: "#features" },
      { name: "Tarifs", href: "#pricing" },
      { name: "Applications", href: "#apps" },
      { name: "Nouveautés", href: "#updates" },
    ],
  },
  {
    title: "Entreprise",
    links: [
      { name: "À propos", href: "#about" },
      { name: "Carrières", href: "#careers" },
      { name: "Presse", href: "#press" },
      { name: "Contact", href: "#contact" },
    ],
  },
  {
    title: "Ressources",
    links: [
      { name: "Blog", href: "#blog" },
      { name: "Aide", href: "#help" },
      { name: "Tutoriels", href: "#tutorials" },
      { name: "API", href: "#api" },
    ],
  },
  {
    title: "Légal",
    links: [
      { name: "Confidentialité", href: "#privacy" },
      { name: "Conditions", href: "#terms" },
      { name: "Cookies", href: "#cookies" },
      { name: "Licences", href: "#licenses" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <FaTree className="text-blue-400 text-2xl" />
              <span className="text-xl font-bold">GeneaTree</span>
            </div>
            <p className="text-gray-400 mb-6">
              Préservons ensemble <br />
               votre héritage familial <br />
             pour les générations <br /> futures.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FaLinkedin size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FaYoutube size={20} />
              </a>
            </div>
          </div>

          {footerLinks.map((column, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold mb-2">{column.title}</h3>
              <ul className="space-y-3">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-blue-400 transition"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} GeneaTree. Tous droits réservés.
          </p>
          <div className="flex space-x-6">
            <Link href="#" className="text-gray-500 hover:text-white text-sm transition">
              Confidentialité
            </Link>
            <Link href="#" className="text-gray-500 hover:text-white text-sm transition">
              Conditions
            </Link>
            <Link href="#" className="text-gray-500 hover:text-white text-sm transition">
              Préférences
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}