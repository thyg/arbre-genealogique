// app/tree/page.tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { FaUser, FaPlus, FaSearch, FaEye, FaShareAlt, FaHome } from 'react-icons/fa';

export default function TreePage() {
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [generations, setGenerations] = useState(5);
  
  // Données fictives pour l'exemple
  const userData = {
    name: 'Jean Dupont',
    treeName: 'Famille Dupont'
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header principale */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <img 
                  src="/api/placeholder/40/40" 
                  alt="MyHeritage" 
                  className="h-8 w-auto" 
                />
                <span className="ml-2 text-xl font-semibold text-gray-900">MyHeritage</span>
              </Link>
              
              <nav className="ml-10 flex space-x-8">
                <Link href="/tree" className="text-gray-900 hover:text-gray-700 px-3 py-2 font-medium border-b-2 border-blue-500">
                  Arbre
                </Link>
                <Link href="/photos" className="text-gray-500 hover:text-gray-900 px-3 py-2 font-medium">
                  Photos
                </Link>
                <Link href="/search" className="text-gray-500 hover:text-gray-900 px-3 py-2 font-medium">
                  Recherche
                </Link>
                <Link href="/dna" className="text-gray-500 hover:text-gray-900 px-3 py-2 font-medium">
                  ADN
                </Link>
                <Link href="/help" className="text-gray-500 hover:text-gray-900 px-3 py-2 font-medium">
                  Aide
                </Link>
              </nav>
            </div>
            
            <div className="flex items-center">
              <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
                <FaSearch className="h-5 w-5" />
              </button>
              <button className="ml-4 p-2 rounded-full text-gray-500 hover:bg-gray-100">
                <FaUser className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Sous-header avec le nom de l'arbre */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center">
              <h2 className="text-sm font-medium text-gray-700">{userData.name} Family Tree</h2>
              <span className="mx-2 text-gray-400">•</span>
              <span className="text-sm text-gray-500">«Privé»</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="flex items-center text-orange-500 hover:text-orange-600 font-medium text-sm">
                <FaEye className="mr-2" />
                Vue famille
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Carte de profil et contrôles */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex">
          {/* Sidebar avec profil */}
          <div className="w-64 border-r border-gray-200 py-6 pr-4">
            <div className="flex flex-col items-center mb-6">
              <div className="h-20 w-20 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center mb-3">
                <FaUser className="h-10 w-10 text-gray-400" />
              </div>
              <div className="text-center">
                <h3 className="text-sm font-medium text-gray-900">«Privé» {userData.name}</h3>
                <p className="text-xs text-gray-500">1 personne sur 1</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <button className="w-full flex items-center justify-center py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded text-sm text-gray-700">
                <FaUser className="mr-2" /> Profil
              </button>
              <button className="w-full flex items-center justify-center py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded text-sm text-gray-700">
                <FaEye className="mr-2" /> Voir son arbre
              </button>
            </div>
          </div>
          
          {/* Contenu principal - Zone de l'arbre */}
          <div className="flex-1 p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <span className="text-sm text-gray-700 mr-2">Générations:</span>
                <select 
                  value={generations}
                  onChange={(e) => setGenerations(parseInt(e.target.value))}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  {[1, 2, 3, 4, 5, 6, 7].map(gen => (
                    <option key={gen} value={gen}>{gen}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher une personne..."
                    className="border border-gray-300 rounded-md pl-10 pr-4 py-2 text-sm w-64"
                  />
                  <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
                </div>
                <button className="ml-4 p-2 rounded-full hover:bg-gray-100">
                  <FaPlus className="h-5 w-5 text-gray-500" />
                </button>
                <button className="ml-2 p-2 rounded-full hover:bg-gray-100">
                  <FaShareAlt className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            {/* Zone de l'arbre généalogique */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="h-20 w-20 rounded-full bg-white border border-gray-300 flex items-center justify-center mx-auto mb-4">
                  <FaUser className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">{userData.name}</h3>
                <p className="text-sm text-gray-500 mt-1">Né(e) le: --</p>
                <p className="text-sm text-gray-500">Lieu: --</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Boutons de contrôle de zoom */}
      <div className="fixed bottom-8 right-8 flex flex-col space-y-2">
        <button className="h-8 w-8 rounded bg-white shadow-md flex items-center justify-center hover:bg-gray-100">
          <FaHome className="text-gray-600" />
        </button>
        <button className="h-8 w-8 rounded bg-white shadow-md flex items-center justify-center hover:bg-gray-100">
          <span className="text-gray-600 font-bold">+</span>
        </button>
        <button className="h-8 w-8 rounded bg-white shadow-md flex items-center justify-center hover:bg-gray-100">
          <span className="text-gray-600 font-bold">-</span>
        </button>
      </div>
    </div>
  );
}