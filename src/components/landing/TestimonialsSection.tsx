// src/components/landing/TestimonialsSection.tsx
const testimonials = [
    {
      quote: "J'ai découvert des branches de ma famille que je ne connaissais pas !",
      author: "Marie Douma., Dschang"
    },
    {
      quote: "L'outil le plus simple pour partager notre histoire avec nos enfants.",
      author: "Jean Paul ., Yaoundé"
    },
    {
      quote: "Enfin une plateforme qui respecte la confidentialité des données familiales.",
      author: "Sophie L., Bruxelles"
    }
  ];
  
  export default function TestimonialsSection() {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16 text-gray-800">
            Ce que nos utilisateurs en disent
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-md">
                <blockquote className="text-lg italic mb-6 text-gray-700">
                  "{testimonial.quote}"
                </blockquote>
                <p className="font-semibold text-gray-800">— {testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }