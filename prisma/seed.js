import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import {
  initialProductData,
  initialTestimonials,
  initialGalleries
} from '../data/initialData.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seeding...');

  // 1. Créer l'admin par défaut
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@indigenat.com' },
    update: {},
    create: {
      email: 'admin@indigenat.com',
      password: hashedPassword,
      name: 'Administrateur',
      role: 'admin'
    }
  });
  console.log(`✅ Admin créé: ${admin.email}`);

  // 2. Vérifier si un produit existe déjà
  const existingProduct = await prisma.product.findFirst({
    where: { title: initialProductData.title }
  });

  if (existingProduct) {
    console.log('⚠️  Produit existe déjà, skipping...');
  } else {
    // 3. Créer le produit
    const product = await prisma.product.create({
      data: initialProductData
    });
    console.log(`✅ Produit créé: ${product.title}`);

    // 4. Créer les témoignages
    for (const testimonial of initialTestimonials) {
      await prisma.testimonial.create({
        data: {
          ...testimonial,
          productId: product.id
        }
      });
    }
    console.log(`✅ ${initialTestimonials.length} témoignages créés`);

    // 5. Créer la galerie
    for (const gallery of initialGalleries) {
      await prisma.gallery.create({
        data: {
          ...gallery,
          productId: product.id
        }
      });
    }
    console.log(`✅ ${initialGalleries.length} images de galerie créées`);
  }

  // 6. Créer les paramètres du site
  const settings = await prisma.siteSettings.upsert({
    where: { id: 'default-settings' },
    update: {},
    create: {
      id: 'default-settings',
      contactPhone: initialProductData.contactPhone,
      whatsappNumber: initialProductData.whatsappNumber,
      email: initialProductData.email,
      address: "123 Rue Tradition, 75000 Paris, France",
      socialLinks: {
        facebook: "https://facebook.com/nyangatradition",
        instagram: "https://instagram.com/nyangatradition"
      }
    }
  });
  console.log('✅ Paramètres du site créés');

  console.log('🎉 Seeding terminé avec succès!');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });