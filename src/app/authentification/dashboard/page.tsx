'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [userInfo, setUserInfo] = useState({
    name: 'John Doe',  // Données fictives, à remplacer par celles de l'utilisateur
    email: 'john@example.com',
    registrationDate: '2023-03-10',
    lastLogin: '2025-04-25',
  });

  const router = useRouter();

  return (
    <section className="relative bg-gradient-to-br from-green-900 to-green-500 text-white pt-24 pb-20 min-h-screen overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center">
          {/* Partie gauche */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:w-1/2 mb-12 lg:mb-0"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Tableau de bord de <span className="text-green-400">l'utilisateur</span>
            </h1>
            <p className="text-xl mb-8 text-green-200 max-w-lg">
              Accédez à vos informations personnelles et à des raccourcis pour gérer votre compte.
            </p>
          </motion.div>

          {/* Partie droite */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            className="lg:w-1/2 w-full"
          >
            <motion.div
              className="relative bg-white/10 rounded-2xl p-8 backdrop-blur-md border border-white/20 shadow-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-col gap-6">
                <div className="rounded-md shadow-sm space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">Informations personnelles</h3>
                    <p className="text-sm text-gray-300">Nom : {userInfo.name}</p>
                    <p className="text-sm text-gray-300">Email : {userInfo.email}</p>
                    <p className="text-sm text-gray-300">Inscrit depuis : {userInfo.registrationDate}</p>
                    <p className="text-sm text-gray-300">Dernière connexion : {userInfo.lastLogin}</p>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <Link href="/profile">
                    <motion.a
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6 }}
                      className="block py-2 px-4 bg-blue-300 text-blue-900 rounded-lg font-bold text-center hover:bg-blue-400 transition"
                    >
                      Modifier mon profil
                    </motion.a>
                  </Link>
                  <Link href="/settings">
                    <motion.a
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6 }}
                      className="block py-2 px-4 bg-blue-300 text-blue-900 rounded-lg font-bold text-center hover:bg-blue-400 transition"
                    >
                      Paramètres du compte
                    </motion.a>
                  </Link>
                  <Link href="/logout">
                    <motion.a
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6 }}
                      className="block py-2 px-4 bg-red-300 text-red-900 rounded-lg font-bold text-center hover:bg-red-400 transition"
                    >
                      Se déconnecter
                    </motion.a>
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
}
