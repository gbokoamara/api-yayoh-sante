// src/controllers/productController.js
import { PrismaClient } from '@prisma/client';
import { initialProductData } from '../../data/initialData.js';

const prisma = new PrismaClient();

// ==================== PRODUITS ====================

// Récupérer tous les produits (pour l'admin)
export const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        testimonials: true,
        galleries: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer un produit par ID (pour le frontend)
export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        testimonials: {
          where: { approved: false },
          orderBy: { createdAt: 'desc' }
        },
        galleries: {
          orderBy: { order: 'asc' }
        }
      }
    });
    
    if (!product) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer le produit principal
export const getMainProduct = async (req, res) => {
  try {
    let product = await prisma.product.findFirst({
      include: {
        testimonials: {
          where: { approved: false },
          orderBy: { createdAt: 'desc' }
        },
        galleries: {
          orderBy: { order: 'asc' }
        }
      }
    });

    // Si pas de produit en base, retourner les données initiales
    if (!product) {
      product = {
        ...initialProductData,
        testimonials: [],
        galleries: [],
        id: 'default',
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }

    res.json(product);
  } catch (error) {
    console.error('Erreur:', error);
    // Fallback aux données initiales en cas d'erreur
    res.json({
      ...initialProductData,
      testimonials: [],
      galleries: [],
      id: 'default'
    });
  }
};

// Créer un produit (admin)
export const createProductOLD = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      description,
      traditionalUse,
      disclaimer,
      mainImage,
      images
    } = req.body;

    console.log("req.body", req.body);
    // Vérifier si un produit avec ce titre existe déjà
    const existingProduct = await prisma.product.findFirst({
      where: { title }
    });

    if (existingProduct) {
      return res.status(400).json({ error: 'Un produit avec ce titre existe déjà' });
    }

    const product = await prisma.product.create({
      data: {
        title,
        subtitle,
        description,
        traditionalUse,
        disclaimer: disclaimer || initialProductData.disclaimer,
        mainImage,
        images: images || []
      }
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// productController.js
export const createProduct = async (req, res) => {
  console.log("=== DEBUG ===");
  console.log("Headers:", req.headers['content-type']);
  console.log("Body reçu:", req.body);
  console.log("=== FIN DEBUG ===");
  
  try {
    // Si req.body est vide, c'est un problème de parsing
    if (!req.body || Object.keys(req.body).length === 0) {
      console.log("⚠️ req.body est VIDE - Problème de parsing!");
      
      // Essayer de lire les données brutes
      let rawData = '';
      req.on('data', chunk => {
        rawData += chunk.toString();
      });
      
      req.on('end', async () => {
        console.log("Données brutes:", rawData);
        try {
          const parsedData = JSON.parse(rawData);
          await createProductFromData(parsedData, res);
        } catch (parseError) {
          res.status(400).json({ 
            error: "Format de données invalide",
            details: parseError.message 
          });
        }
      });
      return;
    }
    
    // Si on arrive ici, req.body est défini
    await createProductFromData(req.body, res);
    
  } catch (error) {
    console.error("❌ Erreur générale:", error);
    res.status(500).json({ 
      error: "Erreur serveur",
      details: error.message 
    });
  }
};

// Fonction séparée pour créer le produit
async function createProductFromData(data, res) {
  try {
    const {
      title,
      price,
      subtitle,
      description,
      traditionalUse,
      disclaimer,
      mainImage,
      images,
      contactPhone,
      whatsappNumber,
       email
    } = data;

    console.log("📦 Données à sauvegarder:", {
      title,
      subtitle: subtitle?.substring(0, 50) + "...",
      description: description?.substring(0, 50) + "...",
      hasImages: Array.isArray(images) ? images.length : 0
    });

    // Validation obligatoire
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Le titre est obligatoire' });
    }

    // Créer le produit
    const product = await prisma.product.create({
      data: {
        title: title.trim(),
        price: price || 0,
        subtitle: subtitle || null,
        description: description || '',
        traditionalUse: traditionalUse || '',
        disclaimer: disclaimer || 'Ce produit est un témoignage d\'un savoir-faire traditionnel...',
        mainImage: mainImage || '',
        images: images || [],
        contactPhone:contactPhone || '',
       whatsappNumber: whatsappNumber || '',
       email: email || ''
      }
    });

    console.log("✅ Produit créé avec ID:", product.id);
    res.status(201).json(product);
    
  } catch (error) {
    console.error("❌ Erreur création produit:", error);
    res.status(400).json({ 
      error: error.message,
      code: error.code 
    });
  }
}

// Mettre à jour un produit (admin)
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const product = await prisma.product.update({
      where: { id },
      data
    });

    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Supprimer un produit (admin)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.product.delete({
      where: { id }
    });

    res.json({ message: 'Produit supprimé avec succès' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ==================== TÉMOIGNAGES ====================

// Ajouter un témoignage
export const addTestimonial = async (req, res) => {
  try {
    // const { productId } = req.params;
    const { name, location, text, rating, avatar } = req.body;

    // 1. Trouver le produit principal (ou le premier produit)
    const mainProduct = await prisma.product.findFirst();
    
    if (!mainProduct) {
      return res.status(404).json({ 
        error: 'Aucun produit trouvé. Créez d\'abord un produit.' 
      });
    }

    // Validation manuelle du rating
    const ratingValue = parseInt(rating);
    if (ratingValue < 1 || ratingValue > 5) {
      return res.status(400).json({ error: 'Le rating doit être entre 1 et 5' });
    }

    // Validation des champs requis
    if (!name || !text) {
      return res.status(400).json({ error: 'Le nom et le texte sont obligatoires' });
    }

    // // Si productId est "default", on cherche le premier produit
    // let actualProductId = productId;
    // if (productId === 'default') {
    //   const product = await prisma.product.findFirst();
    //   if (!product) {
    //     return res.status(404).json({ error: 'Aucun produit trouvé' });
    //   }
    //   actualProductId = product.id;
    // }

    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        location,
        text,
        rating: ratingValue,
        avatar: avatar || null,
        productId: mainProduct.id,
        approved: false
      }
    });

    res.status(201).json(testimonial);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Récupérer tous les témoignages (admin)
export const getAllTestimonials = async (req, res) => {
  try {
    const { approved } = req.query;
    
    const where = {};
    if (approved !== undefined) {
      where.approved = approved === 'true';
    }

    const testimonials = await prisma.testimonial.findMany({
      where,
      include: {
        product: {
          select: {
            title: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Approuver un témoignage (admin)
export const approveTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: { approved: true }
    });

    res.json(testimonial);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Supprimer un témoignage (admin)
export const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.testimonial.delete({
      where: { id }
    });

    res.json({ message: 'Témoignage supprimé avec succès' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ==================== GALERIE ====================

// Ajouter une image/vidéo à la galerie (admin)
export const addGalleryItemOLD = async (req, res) => {
  try {
    const { productId } = req.params;
    const { title, imageUrl, videoUrl, type, order } = req.body;

    // Validation
    if (!title || (!imageUrl && !videoUrl)) {
      return res.status(400).json({ 
        error: 'Le titre et au moins une image ou vidéo sont requis' 
      });
    }

    const galleryItem = await prisma.gallery.create({
      data: {
        title,
        imageUrl: imageUrl || null,
        videoUrl: videoUrl || null,
        type: type || (videoUrl ? 'video' : 'image'),
        order: order || 0,
        productId
      }
    });

    res.status(201).json(galleryItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Dans votre contrôleur galleryController.js
export const addGalleryItem = async (req, res) => {
  try {
    const { title, type, order, imageUrl } = req.body;
    
    // 1. Trouver le produit principal (ou le premier produit)
    const mainProduct = await prisma.product.findFirst();
    
    if (!mainProduct) {
      return res.status(404).json({ 
        error: 'Aucun produit trouvé. Créez d\'abord un produit.' 
      });
    }
    
    // 2. Créer l'entrée galerie avec le productId
    const galleryItem = await prisma.gallery.create({
      data: {
        title,
        imageUrl,
        videoUrl: type === 'video' ? imageUrl : null,
        type,
        order: parseInt(order) || 0,
        productId: mainProduct.id // ← ICI, on associe au produit
      }
    });
    
    res.status(201).json(galleryItem);
    
  } catch (error) {
    console.error('❌ Erreur création galerie:', error);
    res.status(400).json({ error: error.message });
  }
};

// Récupérer tous les éléments de galerie (admin)
export const getAllGalleryItems = async (req, res) => {
  try {
    const { productId } = req.params;

    const galleryItems = await prisma.gallery.findMany({
      where: { productId },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }]
    });

    res.json(galleryItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour l'ordre de la galerie (admin)
export const updateGalleryOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { order } = req.body;

    if (order === undefined) {
      return res.status(400).json({ error: 'L\'ordre est requis' });
    }

    const galleryItem = await prisma.gallery.update({
      where: { id },
      data: { order: parseInt(order) }
    });

    res.json(galleryItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Supprimer un élément de galerie (admin)
export const deleteGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.gallery.delete({
      where: { id }
    });

    res.json({ message: 'Élément de galerie supprimé avec succès' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ==================== PARAMÈTRES DU SITE ====================

// Récupérer les paramètres du site
export const getSiteSettings = async (req, res) => {
  try {
    let settings = await prisma.siteSettings.findFirst();

    if (!settings) {
      settings = {
        contactPhone: initialProductData.contactPhone,
        whatsappNumber: initialProductData.whatsappNumber,
        email: initialProductData.email,
        address: "123 Rue Tradition, 75000 Paris, France",
        socialLinks: {
          facebook: "https://facebook.com/nyangatradition",
          instagram: "https://instagram.com/nyangatradition"
        }
      };
    }

    res.json(settings);
  } catch (error) {
    res.json({
      contactPhone: initialProductData.contactPhone,
      whatsappNumber: initialProductData.whatsappNumber,
      email: initialProductData.email
    });
  }
};

// Mettre à jour les paramètres du site (admin)
export const updateSiteSettings = async (req, res) => {
  try {
    const { contactPhone, whatsappNumber, email, address, socialLinks } = req.body;

    const settings = await prisma.siteSettings.upsert({
      where: { id: 'default-settings' },
      update: {
        contactPhone,
        whatsappNumber,
        email,
        address,
        socialLinks
      },
      create: {
        id: 'default-settings',
        contactPhone,
        whatsappNumber,
        email,
        address,
        socialLinks
      }
    });

    res.json(settings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ==================== STATISTIQUES (admin) ====================

export const getDashboardStats = async (req, res) => {
  try {
    const [
      productCount,
      testimonialCount,
      approvedTestimonialCount,
      galleryCount
    ] = await Promise.all([
      prisma.product.count(),
      prisma.testimonial.count(),
      prisma.testimonial.count({ where: { approved: true } }),
      prisma.gallery.count()
    ]);

    res.json({
      products: productCount,
      testimonials: testimonialCount,
      approvedTestimonials: approvedTestimonialCount,
      pendingTestimonials: testimonialCount - approvedTestimonialCount,
      galleryItems: galleryCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==================== VALIDATION ====================

// Validation des données produit
export const validateProduct = (req, res, next) => {
  const { title, description, mainImage } = req.body;

  if (!title || title.trim().length < 3) {
    return res.status(400).json({ error: 'Le titre doit avoir au moins 3 caractères' });
  }

  if (!description || description.trim().length < 10) {
    return res.status(400).json({ error: 'La description doit avoir au moins 10 caractères' });
  }

  if (!mainImage) {
    return res.status(400).json({ error: 'Une image principale est requise' });
  }

  next();
};

// Validation des données témoignage
export const validateTestimonial = (req, res, next) => {
  const { name, text, rating } = req.body;

  if (!name || name.trim().length < 2) {
    return res.status(400).json({ error: 'Le nom doit avoir au moins 2 caractères' });
  }

  if (!text || text.trim().length < 10) {
    return res.status(400).json({ error: 'Le témoignage doit avoir au moins 10 caractères' });
  }

  if (rating && (rating < 1 || rating > 5)) {
    return res.status(400).json({ error: 'La note doit être entre 1 et 5' });
  }

  next();
};