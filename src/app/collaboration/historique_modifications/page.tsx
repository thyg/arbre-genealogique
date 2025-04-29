'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function History() {
  const [history, setHistory] = useState([
    { id: 1, action: 'Modification du profil', date: '2025-04-25 10:30', details: 'Nom modifié de John Doe à John Smith' },
    { id: 2, action: 'Changement de mot de passe', date: '2025-04-24 15:15', details: 'Le mot de passe a été modifié.' },
    { id: 3, action: 'Modification du profil', date: '2025-04-23 09:45', details: 'Email modifié de john@example.com à johnsmith@example.com' },
    { id: 4, action: 'Connexion', date: '2025-04-22 08:20', details: 'Connexion depuis l’appareil "iPhone 13" (IP: 192.168.1.1)' },
    { id: 5, action: 'Ajout de paiement', date: '2025-04-21 14:00', details: 'Carte Mastercard ****-****-****-4242 ajoutée' },
    { id: 6, action: 'Achat effectué', date: '2025-04-20 11:30', details: 'Achat du produit "Formation React avancé" (59.99 €)' },
    { id: 7, action: 'Déconnexion', date: '2025-04-19 22:05', details: 'Session terminée après 2h45 d’inactivité' },
    { id: 8, action: 'Modification des préférences', date: '2025-04-18 16:40', details: 'Langue changée en Français' },
    { id: 9, action: 'Suppression de compte', date: '2025-04-17 12:10', details: 'Demande de suppression de compte initiée' },
    { id: 10, action: 'Annulation d’achat', date: '2025-04-16 09:55', details: 'Remboursement pour la commande #12345 (59.99 €)' },
    { id: 11, action: 'Mise à jour du profil', date: '2025-04-15 17:25', details: 'Photo de profil modifiée' },
    { id: 12, action: 'Connexion suspecte', date: '2025-04-14 03:30', details: 'Tentative de connexion depuis un nouvel appareil (Bloquée)' },
    { id: 13, action: 'Achat effectué', date: '2025-04-20 11:30', details: 'Achat du produit "Formation React avancé" (59.99 €)' },
    { id: 14, action: 'Déconnexion', date: '2025-04-19 22:05', details: 'Session terminée après 2h45 d’inactivité' },
    { id: 15, action: 'Modification des préférences', date: '2025-04-18 16:40', details: 'Langue changée en Français' },
  ]);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const router = useRouter();

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

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
              Historique des <span className="text-green-400">modifications</span>
            </h1>
            <p className="text-xl mb-8 text-green-200 max-w-lg">
              Consultez l'historique des modifications effectuées sur votre compte.
            </p>
          </motion.div>

          {/* Partie droite */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            className="lg:w-1/2 w-full overflow-y-auto max-h-[calc(100vh-120px)]"
          >
            <motion.div
              className="relative bg-white/10 rounded-2xl p-8 backdrop-blur-md border border-white/20 shadow-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="space-y-4">
                {history.map((event, index) => (
                  <div key={event.id} className="p-4 bg-white/20 rounded-lg shadow-md">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-green-100">{event.action}</h3>
                      <button
                        onClick={() => toggleAccordion(index)}
                        className="text-green-400"
                      >
                        {activeIndex === index ? 'Masquer' : 'Voir les détails'}
                      </button>
                    </div>
                    <p className="text-sm text-green-300">{event.date}</p>
                    {activeIndex === index && (
                      <p className="mt-2 text-sm text-green-200">{event.details}</p>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
}
