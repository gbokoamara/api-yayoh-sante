import express from 'express';
import { 
  // Produits
  getAllProducts,
  getProduct,
  getMainProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  
  // Témoignages
  addTestimonial,
  getAllTestimonials,
  approveTestimonial,
  deleteTestimonial,
  
  // Galerie
  addGalleryItem,
  getAllGalleryItems,
  updateGalleryOrder,
  deleteGalleryItem,
  
  // Paramètres
  getSiteSettings,
  updateSiteSettings,
  
  // Statistiques
  getDashboardStats,
  
  // Validation
  validateProduct,
  validateTestimonial,
  updateGalleryItem,
  updateTestimonial
} from '../controllers/productController.js';

import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// ==================== ROUTES PUBLIQUES ====================

// Produit principal (pour le frontend)
router.get('/main', getMainProduct);

// Récupérer un produit spécifique
router.get('/:id', getProduct);

// Ajouter un témoignage (publique)
router.post('/testimonials',  addTestimonial);

// Paramètres du site
router.get('/settings/site', getSiteSettings);

// ==================== ROUTES ADMIN ====================

// Produits
router.get('/', authenticateAdmin, getAllProducts);
router.post('/', createProduct);
router.put('/:id',  updateProduct);  // authenticateAdmin, validateProduct,
router.delete('/:id', authenticateAdmin, deleteProduct);

// Témoignages (admin)
router.get('/testimonials/all', authenticateAdmin, getAllTestimonials);
router.post('/testimonials', addTestimonial); // Ajouter cette ligne
router.put('/testimonials/:id',  updateTestimonial); // Ajouter cette ligne authenticateAdmin,
router.put('/testimonials/:id/approve', approveTestimonial);
router.delete('/testimonials/:id', deleteTestimonial);

// Galerie (admin)
router.post('/gallery', addGalleryItem);
router.get('/:productId/gallery', authenticateAdmin, getAllGalleryItems);
router.put('/gallery/:id', updateGalleryItem);
router.put('/gallery/:id/order', authenticateAdmin, updateGalleryOrder);
router.delete('/gallery/:id',  deleteGalleryItem);

// Paramètres du site (admin)
router.put('/settings/site', authenticateAdmin, updateSiteSettings);

// Dashboard (admin)
router.get('/stats/dashboard', authenticateAdmin, getDashboardStats);

export default router;