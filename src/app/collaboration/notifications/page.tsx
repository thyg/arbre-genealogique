'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function Notifications() {
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Votre profil a été mis à jour.', read: false },
    { id: 2, message: 'Un nouvel article est disponible.', read: false },
    { id: 3, message: 'Un commentaire a été ajouté à votre article.', read: true },
  ]);
  const [newNotification, setNewNotification] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleMarkAsRead = (id: number) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const handleAddNotification = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newNotification.trim()) return;

    setIsLoading(true);
    // Simuler une requête API ici
    setTimeout(() => {
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        { id: prevNotifications.length + 1, message: newNotification, read: false },
      ]);
      setNewNotification('');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <section className="relative bg-gradient-to-br from-green-900 to-green-500 text-black pt-24 pb-20 min-h-screen overflow-hidden">
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
              Notifications <span className="text-green-400">de la plateforme</span>
            </h1>
            <p className="text-xl mb-8 text-green-200 max-w-lg">
              Gérez et consultez les notifications concernant votre activité sur la plateforme.
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
              <div className="space-y-4">
                {/* Liste des notifications */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Notifications récentes</h3>
                  <ul className="space-y-3">
                    {notifications.map((notification) => (
                      <li
                        key={notification.id}
                        className={`p-4 rounded-md border ${
                          notification.read ? 'border-green-500 bg-green-100' : 'border-gray-300 bg-gray-100'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <p className="text-sm">{notification.message}</p>
                          {!notification.read && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="bg-green-500 text-black px-4 py-1 rounded-md hover:bg-green-600 transition"
                            >
                              Marquer comme lu
                            </button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Ajouter une notification */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Ajouter une notification</h3>
                  <form onSubmit={handleAddNotification} className="flex flex-col gap-4">
                    <textarea
                      value={newNotification}
                      onChange={(e) => setNewNotification(e.target.value)}
                      className="p-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Entrez votre message ici..."
                      rows={4}
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-green-300 flex justify-center py-2 px-4 text-green-900 rounded-lg font-bold hover:bg-green-400 transition"
                    >
                      {isLoading ? 'Ajout en cours...' : 'Ajouter la notification'}
                    </button>
                  </form>
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
