'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from 'lucide-react'; // Pour icônes (si tu veux un autre style, dis-moi)

export default function Inscription() {
  const [error, setError] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    if (!formData.name.trim()) newErrors.name = 'Le nom est requis';
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit faire au moins 6 caractères';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  {/** 
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!validateForm()) return;
      
      setIsLoading(true);
      
      try {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password
          }),
        });
        
        if (response.ok) {
          router.push('/authentification/login');
        } else {
          const data = await response.json();
          setErrors(prev => ({ ...prev, form: data.message || 'Erreur lors de l\'inscription' }));
        }
      } catch (error) {
        setErrors(prev => ({ ...prev, form: 'Erreur réseau' }));
      } finally {
        setIsLoading(false);
      }
    };
    */}


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      setError(true);
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      router.push("/authentification/login");
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
              Rejoignez notre <span className="text-blue-300">communauté</span>
            </h1>
            <p className="text-xl mb-8 text-blue-200 max-w-lg">
              Créez votre compte gratuitement et commencez à construire votre arbre généalogique dès aujourd'hui !
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/authentification/login"
                className="border border-blue-300 text-blue-300 px-8 py-4 rounded-lg font-semibold text-center hover:bg-blue-300 hover:text-blue-900 transition"
              >
                Vous avez déjà un compte ?
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
                key={error ? "error" : "noerror"}
                animate={error ? { x: [-10, 10, -6, 6, -2, 2, 0] } : { x: 0 }}
                transition={{ duration: 0.5 }}
                className="relative bg-white/10 rounded-2xl p-8 backdrop-blur-md border border-white/20 shadow-lg"
              >
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4 }}
                      className="mb-6 p-4 text-red-300 bg-red-500/20 border border-red-300/30 rounded-lg text-center"
                    >
                      Merci de remplir tous les champs correctement avant de valider.
                    </motion.div>
                  )}
                </AnimatePresence>

                <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                  <div className="rounded-md shadow-sm space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-white mb-1">
                        Nom complet
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-4 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-write font-bold `}
                      />
                      {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-white mb-1">
                        Adresse email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-write font-semibold`}
                      />
                      {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
                    </div>

                    <div className="relative">
                      <label htmlFor="password" className="block text-sm font-semibold text-white mb-1">
                        Mot de passe
                      </label>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-4 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-write font-semibold`}
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-blue-800">
                        {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                      </button>
                      {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
                    </div>

                    <div className="relative">
                      <label htmlFor="confirmPassword" className="block text-sm font-semibold text-white mb-1">
                        Confirmer le mot de passe
                      </label>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-4 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-write font-semibold`}
                      />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-9 text-blue-800">
                        {showConfirmPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                      </button>
                      {errors.confirmPassword && <p className="mt-1 text-sm text-red-600 ">{errors.confirmPassword}</p>}
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-blue-300 flex justify-center items-center py-3 w-full text-blue-900 font-bold rounded-lg hover:bg-blue-400 transition disabled:opacity-50"
                    >
                      {isLoading ? 'Inscription en cours...' : 'Créer mon compte'}
                    </button>
                  </div>

                  {errors.form && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                      {errors.form}
                    </div>
                  )}
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
