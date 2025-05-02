'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaUser, FaPlus, FaArrowRight, FaArrowLeft, FaUserPlus } from 'react-icons/fa';

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [treeName, setTreeName] = useState('');
  
  // Premier membre (l'utilisateur)
  const [userName, setUserName] = useState('');
  const [gender, setGender] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  
  // Deuxième membre (le parent ou l'enfant)
  const [relationDirection, setRelationDirection] = useState(''); // 'source' ou 'cible'
  const [relationType, setRelationType] = useState('');
  const [relatedPersonName, setRelatedPersonName] = useState('');
  const [relatedPersonGender, setRelatedPersonGender] = useState('');
  const [relatedPersonBirthDate, setRelatedPersonBirthDate] = useState('');
  const [relatedPersonBirthPlace, setRelatedPersonBirthPlace] = useState('');
  const [relatedPersonImage, setRelatedPersonImage] = useState(null);
  
  const fileInputRef = useRef(null);
  const relatedPersonFileInputRef = useRef(null);
  
  const handleImageUpload = (e, setImageFunction) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageFunction(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleCreateTree = () => {
    // Enregistrer les données de base dans le localStorage
    localStorage.setItem('treeName', treeName);
    localStorage.setItem('userName', userName);
    localStorage.setItem('gender', gender);
    localStorage.setItem('birthDate', birthDate);
    localStorage.setItem('birthPlace', birthPlace);
    if (profileImage) {
      localStorage.setItem('profileImage', profileImage);
    }
    
    // Passer à l'étape 3 pour ajouter une relation
    setStep(3);
  };
  
  const handleCreateRelation = () => {
    // Enregistrer les données de la relation familiale
    const firstPerson = {
      id: 1,
      nom: userName.split(' ').slice(-1)[0], // Extraire le nom de famille
      prenom: userName.split(' ').slice(0, -1).join(' '), // Extraire le(s) prénom(s)
      dateNaissance: birthDate,
      lieuNaissance: birthPlace,
      sexe: gender,
      photo: profileImage,
      role: 'utilisateur'
    };
    
    const secondPerson = {
      id: 2,
      nom: relatedPersonName.split(' ').slice(-1)[0], // Extraire le nom de famille
      prenom: relatedPersonName.split(' ').slice(0, -1).join(' '), // Extraire le(s) prénom(s)
      dateNaissance: relatedPersonBirthDate,
      lieuNaissance: relatedPersonBirthPlace,
      sexe: relatedPersonGender,
      photo: relatedPersonImage,
      role: relationType === 'parent' ? 'parent' : 'enfant'
    };
    
    // Créer l'arbre généalogique
    const arbreGenealogique = {
      id: 1,
      nom: treeName,
      description: `Arbre généalogique de la famille ${userName.split(' ').slice(-1)[0]}`,
      dateCreation: new Date().toISOString(),
      dateDerniereModification: new Date().toISOString(),
      origineGeographique: birthPlace,
      createur: userName,
      estPrive: true
    };
    
    // Créer la relation familiale
    const lienFamilial = {
      id: 1,
      poids: 1,
      typeRelation: relationType,
      source: relationDirection === 'source' ? 1 : 2, // ID de la personne source
      cible: relationDirection === 'source' ? 2 : 1   // ID de la personne cible
    };
    
    // Stocker les données
    localStorage.setItem('arbreGenealogique', JSON.stringify(arbreGenealogique));
    localStorage.setItem('personnes', JSON.stringify([firstPerson, secondPerson]));
    localStorage.setItem('liensFamiliaux', JSON.stringify([lienFamilial]));
    
    // Passer à l'étape finale
    setStep(4);
  };
  
  const handleGoToTree = () => {
    // Rediriger vers la page de l'arbre
    router.push('/tree');
  };
  
  const renderRelationTypeOptions = () => {
    // Différentes options selon que l'utilisateur est la source ou la cible
    if (relationDirection === 'source') {
      return (
        <>
          <option value="">Sélectionnez un type de relation</option>
          <option value="parent">Parent de</option>
          <option value="enfant">Enfant de</option>
          <option value="conjoint">Conjoint(e) de</option>
          <option value="frere_soeur">Frère/Sœur de</option>
        </>
      );
    } else {
      return (
        <>
          <option value="">Sélectionnez un type de relation</option>
          <option value="enfant">Parent de</option>
          <option value="parent">Enfant de</option>
          <option value="conjoint">Conjoint(e) de</option>
          <option value="frere_soeur">Frère/Sœur de</option>
        </>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            {step === 1 ? 'Créez votre arbre généalogique' : 
             step === 2 ? 'Ajoutez-vous à votre arbre' : 
             step === 3 ? 'Ajoutez une relation familiale' :
             'Bienvenue dans votre espace familial'}
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            {step === 1 ? 'Donnez un nom à votre arbre pour commencer' : 
             step === 2 ? 'Commencez par vous ajouter comme premier membre' : 
             step === 3 ? 'Enrichissez votre arbre avec une relation familiale' :
             'Votre arbre a été créé avec succès !'}
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-8">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center ${i <= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  {i}
                </div>
              ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${(step / 4) * 100}%` }}
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
                    onClick={() => fileInputRef.current.click()}
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
                    onChange={(e) => handleImageUpload(e, setProfileImage)}
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
                    placeholder="Ex: Tagne Wafo Dimitri"
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
                <h3 className="text-sm font-medium text-gray-700">Informations supplémentaires</h3>
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

              <div className="flex space-x-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FaArrowLeft className="mr-2" /> Retour
                </button>
                <button
                  onClick={handleCreateTree}
                  disabled={!userName.trim() || !gender}
                  className={`flex-1 flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${userName.trim() && gender ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  Continuer <FaArrowRight className="ml-2" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Add a family relation */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-medium text-blue-800 mb-2">Ajout d'une relation familiale</h3>
                <p className="text-sm text-blue-600">
                  Pour compléter votre arbre, ajoutez une relation familiale avec une autre personne.
                </p>
              </div>
              
              {/* Direction de la relation */}
              {!relationDirection && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Choisissez le type de relation</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button 
                      onClick={() => setRelationDirection('source')}
                      className="p-6 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition"
                    >
                      <div className="flex justify-center mb-4">
                        <FaArrowRight className="h-8 w-8 text-blue-500" />
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Créer une relation à partir de {userName}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Vous êtes la source de la relation (par exemple: vous êtes parent de...)
                      </p>
                    </button>
                    
                    <button 
                      onClick={() => setRelationDirection('cible')}
                      className="p-6 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition"
                    >
                      <div className="flex justify-center mb-4">
                        <FaArrowLeft className="h-8 w-8 text-blue-500" />
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Créer une relation provenant vers {userName}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Vous êtes la cible de la relation (par exemple: vous êtes enfant de...)
                      </p>
                    </button>
                  </div>
                </div>
              )}
              
              {/* Formulaire d'ajout de la personne liée */}
              {relationDirection && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">
                      {relationDirection === 'source' 
                        ? `Ajoutez une personne liée à ${userName}`
                        : `Ajoutez une personne dont ${userName} est lié(e)`}
                    </h3>
                    <button 
                      onClick={() => setRelationDirection('')}
                      className="text-sm text-blue-600 hover:text-blue-500"
                    >
                      Modifier le type de relation
                    </button>
                  </div>
                  
                  <div>
                    <label htmlFor="relationType" className="block text-sm font-medium text-gray-700">
                      Type de relation
                    </label>
                    <select
                      id="relationType"
                      value={relationType}
                      onChange={(e) => setRelationType(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      {renderRelationTypeOptions()}
                    </select>
                  </div>
                  
                  {relationType && (
                    <>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <div 
                            className="flex-shrink-0 h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center cursor-pointer"
                            onClick={() => relatedPersonFileInputRef.current.click()}
                          >
                            {relatedPersonImage ? (
                              <img 
                                src={relatedPersonImage} 
                                alt="Profile" 
                                className="h-full w-full rounded-full object-cover"
                              />
                            ) : (
                              <FaUserPlus className="h-8 w-8 text-blue-600" />
                            )}
                          </div>
                          
                          <input
                            type="file"
                            ref={relatedPersonFileInputRef}
                            onChange={(e) => handleImageUpload(e, setRelatedPersonImage)}
                            accept="image/*"
                            className="hidden"
                          />
                        </div>
                        <div className="flex-1">
                          <label htmlFor="relatedPersonName" className="block text-sm font-medium text-gray-700">
                            Nom complet
                          </label>
                          <input
                            type="text"
                            id="relatedPersonName"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Ex: Tagne Ndembe Joseph"
                            value={relatedPersonName}
                            onChange={(e) => setRelatedPersonName(e.target.value)}
                          />
                          <div className="mt-3">
                            <label className="block text-sm font-medium text-gray-700">Sexe</label>
                            <div className="mt-1 flex items-center space-x-6">
                              <div className="flex items-center">
                                <input
                                  id="related-gender-male"
                                  name="related-gender"
                                  type="radio"
                                  value="masculin"
                                  checked={relatedPersonGender === "masculin"}
                                  onChange={(e) => setRelatedPersonGender(e.target.value)}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                />
                                <label htmlFor="related-gender-male" className="ml-2 block text-sm text-gray-700">
                                  Masculin
                                </label>
                              </div>
                              <div className="flex items-center">
                                <input
                                  id="related-gender-female"
                                  name="related-gender"
                                  type="radio"
                                  value="feminin"
                                  checked={relatedPersonGender === "feminin"}
                                  onChange={(e) => setRelatedPersonGender(e.target.value)}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                />
                                <label htmlFor="related-gender-female" className="ml-2 block text-sm text-gray-700">
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
                            <label htmlFor="relatedPersonBirthDate" className="block text-sm font-medium text-gray-700">
                              Date de naissance
                            </label>
                            <input
                              type="date"
                              id="relatedPersonBirthDate"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              value={relatedPersonBirthDate}
                              onChange={(e) => setRelatedPersonBirthDate(e.target.value)}
                            />
                          </div>
                          <div>
                            <label htmlFor="relatedPersonBirthPlace" className="block text-sm font-medium text-gray-700">
                              Lieu de naissance
                            </label>
                            <input
                              type="text"
                              id="relatedPersonBirthPlace"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Ex: Douala, Cameroun"
                              value={relatedPersonBirthPlace}
                              onChange={(e) => setRelatedPersonBirthPlace(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setStep(2)}
                      className="flex-1 flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <FaArrowLeft className="mr-2" /> Retour
                    </button>
                    <button
                      onClick={handleCreateRelation}
                      disabled={!relationType || !relatedPersonName || !relatedPersonGender}
                      className={`flex-1 flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${relationType && relatedPersonName && relatedPersonGender ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                    >
                      Créer la relation <FaArrowRight className="ml-2" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div className="text-center space-y-8">
              <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100">
                <svg className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Félicitations !</h2>
              <p className="text-gray-600">
                Votre arbre "<span className="font-semibold">{treeName}</span>" a été créé avec succès avec votre première relation familiale.
              </p>
              <div className="space-y-4">
                <button
                  onClick={handleGoToTree}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Voir mon arbre
                </button>
                <button className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <FaPlus className="mr-2" /> Ajouter un autre membre
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Déjà un compte ?{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Connectez-vous
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}