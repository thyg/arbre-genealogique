'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from 'lucide-react'; // Pour les icônes d'affichage mot de passe

export default function Connexion() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email invalide";
    }
    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      router.push("/"); // Redirection après connexion réussie (tu peux changer la route)
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
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:w-1/2 mb-12 lg:mb-0"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Heureux de vous revoir <span className="text-blue-400">!</span>
            </h1>
            <p className="text-xl mb-8 text-blue-200 max-w-lg">
              Connectez-vous pour continuer votre aventure généalogique.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/authentification/signup"
                className="border border-blue-300 text-blue-300 px-8 py-4 rounded-lg font-semibold text-center hover:bg-blue-300 hover:text-blue-900 transition"
              >
                Vous n'avez pas de compte ?
              </Link>
            </div>
          </motion.div>

          {/* Partie droite */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="lg:w-1/2 w-full"
          >
            <AnimatePresence>
              <motion.div
                key="form"
                animate={{ x: 0 }}
                transition={{ duration: 0.5 }}
                className="relative bg-white/10 rounded-2xl p-8 backdrop-blur-md border border-white/20 shadow-lg"
              >
                <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Adresse email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                      />
                      {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                    </div>

                    <div className="relative">
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Mot de passe
                      </label>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                      />
                      <div
                        className="absolute top-9 right-3 text-gray-600 cursor-pointer"
                        onClick={() => setShowPassword(prev => !prev)}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </div>
                      {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-blue-300 flex justify-center py-2 px-4 text-blue-900 font-bold rounded-lg hover:bg-blue-400 transition"
                    >
                      {isLoading ? 'Connexion...' : 'Se connecter'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
}
