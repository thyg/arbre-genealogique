// src/components/landing/CTASection.tsx
import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="py-20 bg-blue-800 text-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-6">Prêt à explorer votre histoire ?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Rejoignez des milliers de familles qui préservent leur héritage avec notre plateforme.
        </p>
        <Link 
          href="/arbre" 
          className="inline-block bg-white text-blue-800 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition"
        >
          Créer un compte gratuit
        </Link>
      </div>
    </section>
  );
}