// src/components/landing/FeaturesSection.tsx
import { FaTree, FaSearch, FaUsers, FaShareAlt } from 'react-icons/fa';

const features = [
  {
    icon: <FaTree className="text-3xl mb-4 text-blue-600" />,
    title: "Arbre interactif",
    description: "Visualisez vos ancêtres dans une interface intuitive et personnalisable."
  },
  {
    icon: <FaSearch className="text-3xl mb-4 text-purple-600" />,
    title: "Recherche avancée",
    description: "Trouvez des connexions familiales avec nos outils de recherche puissants."
  },
  {
    icon: <FaUsers className="text-3xl mb-4 text-green-600" />,
    title: "Collaboration",
    description: "Travaillez ensemble avec votre famille pour construire votre histoire."
  },
  {
    icon: <FaShareAlt className="text-3xl mb-4 text-orange-600" />,
    title: "Partage sécurisé",
    description: "Partagez des branches spécifiques avec vos proches en toute confidentialité."
  }
];

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-16 text-gray-800">
          Vos souvenirs familiaux méritent la meilleure technologie
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6 rounded-lg hover:shadow-lg transition">
              <div className="flex justify-center">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}