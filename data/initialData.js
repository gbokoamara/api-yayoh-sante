// Données initiales pour votre produit
export const initialProductData = {
  title: "Yayoh santé",
  subtitle: "Un héritage naturel",
  description: "Un onguent traditionnel préparé selon le savoir-faire séculaire des communautés locales, à base de plantes soigneusement sélectionnées comme le Moringa, l'Harpagophytum et l'Aloès, récoltées dans le respect de l'environnement.",
  traditionalUse: "Au sein de la communauté, il est utilisé pour apaiser les sensations liées aux fatigues musculaires et articulaires après les longues journées de travail. Son parfum terreux et sa texture riche en font un élément central des rituels de bien-être.",
  disclaimer: "Ce produit est un témoignage d'un savoir-faire traditionnel. Il ne s'agit pas d'un médicament et aucune allégation thérapeutique ou médicale n'est formulée. En cas de problème de santé, consultez un professionnel de santé qualifié.",
  mainImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop',
  images: [
    "/uploads/gallery-1.jpg",
    "/uploads/gallery-2.jpg",
    "/uploads/gallery-3.jpg"
  ],
  contactPhone: "+225 0758019243",
  whatsappNumber: "+2250758019243",
  email: "contact@nyanga-tradition.com"
};

export const initialTestimonials = [
  {
    name: "Marie K.",
    location: "Bordeaux",
    text: "Une découverte incroyable. La texture et l'odeur me rappellent les préparations de ma grand-mère. Un vrai retour aux sources.",
    rating: 5,
    avatar: "/uploads/avatar-1.jpg"
  },
  {
    name: "Amadou D.",
    location: "Dakar",
    text: "Enfin un produit qui honore nos traditions sans les dénaturer. La qualité des ingrédients se sent immédiatement.",
    rating: 5,
    avatar: "/uploads/avatar-2.jpg"
  },
  {
    name: "Sophie L.",
    location: "Lyon",
    text: "J'apprécie particulièrement l'approche respectueuse et transparente. Le baume fait maintenant partie de ma routine bien-être.",
    rating: 4,
    avatar: "/uploads/avatar-3.jpg"
  }
];

export const initialGalleries = [
  {
    title: "Préparation traditionnelle",
    imageUrl: "/uploads/gallery-1.jpg",
    type: "image",
    order: 1
  },
  {
    title: "Ingrédients naturels",
    imageUrl: "/uploads/gallery-2.jpg",
    type: "image",
    order: 2
  },
  {
    title: "Atelier de fabrication",
    imageUrl: "/uploads/gallery-3.jpg",
    type: "image",
    order: 3
  }
];