'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, UserPlus, Send, Copy } from 'lucide-react';
import Image from 'next/image';

export default function InviteMembers() {
  const [email, setEmail] = useState('');
  const [emails, setEmails] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const invitationLink = "https://votreplateforme.com/invite/unique-code";

  const handleAddEmail = () => {
    if (!email.trim()) {
      setErrors({ email: 'Veuillez entrer une adresse email valide' });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors({ email: 'Email invalide' });
      return;
    }

    setEmails([...emails, email]);
    setEmail('');
    setErrors({});
  };

  const handleRemoveEmail = (index: number) => {
    setEmails(emails.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simuler l'envoi des invitations
    setTimeout(() => {
      setIsLoading(false);
      setEmails([]);
      alert('Invitations envoyées avec succès !');
      console.log('Invitation envoyée à:', email);
    }, 1500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(invitationLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <section className="relative bg-gradient-to-br from-blue-900 to-blue-600 text-white pt-24 pb-20 min-h-screen overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center">
          {/* Partie gauche */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:w-1/2 mb-12 lg:mb-0"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-center justify-center mb-6 leading-tight">
              Invitez vos <span className="text-blue-300">collègues</span>
            </h1>
            <h1 className="text-xl mb-8 text-blue-200 max-w-lg">
              Invitez des amis à rejoindre notre plateforme généalogique en Partageant le lien d'invitation ou envoyez des invitations par email. Et commencez à construire votre arbre généalogique ensemble !
            </h1>
            
            <div className="mt-8 mb-6 p-6 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                Lien d'invitation
              </h3>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={invitationLink}
                  readOnly
                  className="flex-1 bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-sm"
                />
                <button
                  onClick={copyToClipboard}
                  className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                >
                  {isCopied ? 'Copié !' : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copier
                    </>
                  )}
                </button>
              </div>
              <div  className="mt-6 block w-full">
                <select
                  id="selectedRole"
                  name="selectedRole"
                 // value={formData.selectedRole}
                 // onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="user">Rôles</option>
                  <option value="admin">Administrateur</option>
                  <option value="moderator">Membre</option>
                </select>
              </div>
              <p className="mt-3 text-sm text-blue-200">
                Partagez ce lien avec vos contacts pour qu'ils puissent rejoindre la plateforme.
              </p>
            </div>


            <motion.div
              className="relative bg-white/10 rounded-2xl p-8 backdrop-blur-md border border-white/20 shadow-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }} >
                
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Mail className="w-6 h-6" />
                Inviter par email
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Adresse email
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@exemple.com"
                      className={`flex-1 bg-white/20 border ${errors.email ? 'border-red-500' : 'border-white/30'} rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300`}
                    />
                    <button
                      type="button"
                      onClick={handleAddEmail}
                      className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-lg transition"
                    >
                      Ajouter
                    </button>
                  </div>
                  {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
                </div>

                {emails.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Emails à inviter:</h3>
                    <div className="max-h-40 overflow-y-auto bg-white/10 rounded-lg p-2 space-y-2">
                      {emails.map((email, index) => (
                        <div key={index} className="flex justify-between items-center bg-white/5 px-3 py-2 rounded">
                          <span>{email}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveEmail(index)}
                            className="text-red-300 hover:text-red-400"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={emails.length === 0 || isLoading}
                    className="w-full bg-blue-500 hover:bg-blue-400 text-white px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      'Envoi en cours...'
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Envoyer les invitations
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
            
          </motion.div>

          {/* Partie droite - Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            className="lg:w-1/2 w-full">

            <div className="w-full md:w-1/2 relative">
            {/* Image principale */}
            <div className=" w-280 h-80 md:h-150 relative">
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                    <Image 
                    src="/images/Inviter.jpeg"  // Remplacez par le chemin de votre image
                    alt="Description de l'image"
                    width={600}  // Largeur de l'image
                    height={80} // Hauteur de l'image
                    className="object-cover rounded-lg" // Vous pouvez ajuster la classe CSS selon vos besoins
                    />
                </div>
            </div>
            </div>
            
          </motion.div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
}