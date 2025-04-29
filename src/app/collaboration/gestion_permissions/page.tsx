'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function RolePermissionManagement() {
  const [formData, setFormData] = useState({
    userName: 'John Doe', // Données fictives, à remplacer par celles de l'utilisateur
    userEmail: 'john@example.com',
    selectedRole: 'user',
    permissions: {
      read: false,
      write: false,
      delete: false,
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        permissions: {
          ...prev.permissions,
          [name]: checked,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.userName.trim()) newErrors.userName = 'Le nom est requis';
    if (!formData.userEmail.trim()) {
      newErrors.userEmail = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.userEmail)) {
      newErrors.userEmail = 'Email invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    // Simuler une requête API ici
    setTimeout(() => {
      setIsLoading(false);
      router.push('/dashboard'); // Redirection après succès
    }, 1000);
  };

  return (
    <section className="relative bg-gradient-to-br from-blue-900 to-blue-500 text-white pt-24 pb-20 min-h-screen overflow-hidden">
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
              Gestion des <span className="text-blue-400">Permissions et Rôles</span>
            </h1>
            <p className="text-xl mb-8 text-blue-200 max-w-lg">
              Gérez les rôles et permissions des utilisateurs de la plateforme.
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
              <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                <div className="rounded-md shadow-sm space-y-4">
                  <div>
                    <label htmlFor="userName" className="block text-sm font-medium text-gray-700">
                      Nom complet
                    </label>
                    <input
                      id="userName"
                      name="userName"
                      type="text"
                      required
                      value={formData.userName}
                      onChange={handleChange}
                      className={`mt-1 block w-full px-3 py-2 border ${errors.userName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                    />
                    {errors.userName && <p className="mt-1 text-sm text-red-600">{errors.userName}</p>}
                  </div>

                  <div>
                    <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700">
                      Adresse email
                    </label>
                    <input
                      id="userEmail"
                      name="userEmail"
                      type="email"
                      required
                      value={formData.userEmail}
                      onChange={handleChange}
                      className={`mt-1 block w-full px-3 py-2 border ${errors.userEmail ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                    />
                    {errors.userEmail && <p className="mt-1 text-sm text-red-600">{errors.userEmail}</p>}
                  </div>

                  <div>
                    <label htmlFor="selectedRole" className="block text-sm font-medium text-gray-700">
                      Rôle de l'utilisateur
                    </label>
                    <select
                      id="selectedRole"
                      name="selectedRole"
                      value={formData.selectedRole}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="user">Utilisateur</option>
                      <option value="admin">Administrateur</option>
                      <option value="moderator">Modérateur</option>
                    </select>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-700">Permissions</h3>
                    <div className="flex gap-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="read"
                          name="read"
                          checked={formData.permissions.read}
                          onChange={handleChange}
                          className="h-4 w-4 text-blue-500"
                        />
                        <label htmlFor="read" className="ml-2 text-sm text-gray-300">
                          Lecture
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="write"
                          name="write"
                          checked={formData.permissions.write}
                          onChange={handleChange}
                          className="h-4 w-4 text-blue-500"
                        />
                        <label htmlFor="write" className="ml-2 text-sm text-gray-300">
                          Écriture
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="delete"
                          name="delete"
                          checked={formData.permissions.delete}
                          onChange={handleChange}
                          className="h-4 w-4 text-blue-500"
                        />
                        <label htmlFor="delete" className="ml-2 text-sm text-gray-300">
                          Suppression
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-blue-300 flex justify-center py-2 px-4 text-blue-900 px-8 py-4 rounded-lg font-bold hover:bg-blue-400 transition"
                  >
                    {isLoading ? 'Enregistrement...' : 'Mettre à jour'}
                  </button>
                </div>
              </form>

              {errors.form && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4">
                  {errors.form}
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
}
