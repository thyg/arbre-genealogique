'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaUser, FaPlus, FaArrowRight, FaCamera } from 'react-icons/fa';

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [treeName, setTreeName] = useState('');
  const [userName, setUserName] = useState('');
  const [gender, setGender] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleClick = () => {
    fileInputRef.current.click();
  };
  
  const handleCreateTree = () => {
    // Enregistrer les données dans le localStorage
    localStorage.setItem('treeName', treeName);
    localStorage.setItem('userName', userName);
    localStorage.setItem('gender', gender);
    localStorage.setItem('birthDate', birthDate);
    localStorage.setItem('birthPlace', birthPlace);
    if (profileImage) {
      localStorage.setItem('profileImage', profileImage);
    }
    
    setStep(3);
  };
  
  const handleGoToTree = () => {
    // Rediriger vers la page de l'arbre
    router.push('/tree');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            {step === 1 ? 'Créez votre arbre généalogique' : 
             step === 2 ? 'Ajoutez-vous à votre arbre' : 
             'Bienvenue dans votre espace familial'}
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            {step === 1 ? 'Donnez un nom à votre arbre pour commencer' : 
             step === 2 ? 'Commencez par vous ajouter comme premier membre' : 
             'Votre arbre a été créé avec succès !'}
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-8">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center ${i <= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  {i}
                </div>
              ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${(step / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step 1: Name your tree */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label htmlFor="treeName" className="block text-sm font-medium text-gray-700">
                  Nom de votre arbre généalogique
                </label>
                <input
                  type="text"
                  id="treeName"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: Famille Tagne"
                  value={treeName}
                  onChange={(e) => setTreeName(e.target.value)}
                />
              </div>
              <button
                onClick={() => setStep(2)}
                disabled={!treeName.trim()}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${treeName.trim() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                Continuer <FaArrowRight className="ml-2" />
              </button>
            </div>
          )}

          {/* Step 2: Add yourself */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div 
                    className="flex-shrink-0 h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center cursor-pointer"
                    onClick={handleClick}
                  >
                    {profileImage ? (
                      <img 
                        src={profileImage} 
                        alt="Profile" 
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <FaUser className="h-8 w-8 text-blue-600" />
                    )}
                  </div>
      
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="userName" className="block text-sm font-medium text-gray-700">
                    Votre nom complet
                  </label>
                  <input
                    type="text"
                    id="userName"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ex: Tagne wafo dimitri"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700">Sexe</label>
                    <div className="mt-1 flex items-center space-x-6">
                      <div className="flex items-center">
                        <input
                          id="gender-male"
                          name="gender"
                          type="radio"
                          value="masculin"
                          checked={gender === "masculin"}
                          onChange={(e) => setGender(e.target.value)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label htmlFor="gender-male" className="ml-2 block text-sm text-gray-700">
                          Masculin
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="gender-female"
                          name="gender"
                          type="radio"
                          value="feminin"
                          checked={gender === "feminin"}
                          onChange={(e) => setGender(e.target.value)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label htmlFor="gender-female" className="ml-2 block text-sm text-gray-700">
                          Féminin
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700">Informations supplémentaires (optionnel)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
                      Date de naissance
                    </label>
                    <input
                      type="date"
                      id="birthDate"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="birthPlace" className="block text-sm font-medium text-gray-700">
                      Lieu de naissance
                    </label>
                    <input
                      type="text"
                      id="birthPlace"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ex: Dschang, Cameroun"
                      value={birthPlace}
                      onChange={(e) => setBirthPlace(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleCreateTree}
                disabled={!userName.trim()}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${userName.trim() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                Créer mon arbre <FaArrowRight className="ml-2" />
              </button>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <div className="text-center space-y-8">
              <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100">
                <svg className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Félicitations !</h2>
              <p className="text-gray-600">
                Votre arbre "<span className="font-semibold">{treeName}</span>" a été créé avec succès.
              </p>
              <div className="space-y-4">
                <button
                  onClick={handleGoToTree}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Voir mon arbre
                </button>
                <button className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <FaPlus className="mr-2" /> Ajouter un membre
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Déjà un compte ?{' '}
            <Link href="/authentification/login" className="font-medium text-blue-600 hover:text-blue-500">
              Connectez-vous
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}