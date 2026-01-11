
// server/src/routes/uploadRoutes.js
import express from 'express';
import multer from 'multer';
import { uploadToCloudinary } from '../utils/cloudinary.js';

const router = express.Router();

// Configuration multer avec limites
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { 
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 10 // Max 10 fichiers
  }
});

// ========== ROUTES D'UPLOAD ==========

// 1. ROUTE PRINCIPALE (celle que GalleryForm utilise)
router.post('/', upload.single('image'), async (req, res) => {
  console.log('📤 Upload route / appelée');
  
  try {
    // Debug: ce que multer reçoit
    console.log('📋 Infos requête:');
    console.log('- Content-Type:', req.headers['content-type']);
    console.log('- Fichier reçu:', req.file ? 'OUI' : 'NON');
    console.log('- Nom du champ:', req.file?.fieldname);
    console.log('- Nom du fichier:', req.file?.originalname);
    console.log('- Taille:', req.file?.size, 'bytes');
    
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        error: 'Aucun fichier reçu. Assurez-vous que le champ FormData s\'appelle "image"' 
      });
    }

    // Upload vers Cloudinary
    console.log('☁️  Upload vers Cloudinary...');
    const result = await uploadToCloudinary(
      req.file.buffer,
      'yayoh-sante/gallery' // Dossier spécifique pour la galerie
    );

    console.log('✅ Cloudinary réussi:', result.secure_url);
    
    res.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      message: 'Image uploadée avec succès sur Cloudinary'
    });

  } catch (error) {
    console.error('❌ Erreur upload:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur lors de l\'upload',
      details: error.message 
    });
  }
});

// 2. ROUTE TEST (pour vérifier que l'API fonctionne)
router.get('/test', (req, res) => {
  console.log('🧪 Test route appelée');
  res.json({ 
    success: true,
    message: 'Route upload fonctionnelle',
    timestamp: new Date().toISOString(),
    cloudinary_configured: !!process.env.CLOUDINARY_CLOUD_NAME
  });
});

// 3. ROUTE POUR UPLOAD MULTIPLE (pour ProductForm)
router.post('/images', upload.array('images', 10), async (req, res) => {
  console.log('📤 Upload multiple appelé, fichiers:', req.files?.length || 0);
  
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Aucune image fournie' 
      });
    }

    const uploadPromises = req.files.map(file =>
      uploadToCloudinary(file.buffer, 'yayoh-sante/products')
    );

    const results = await Promise.all(uploadPromises);

    res.json({
      success: true,
      urls: results.map(r => r.secure_url),
      count: results.length,
      message: `${results.length} image(s) uploadée(s)`
    });

  } catch (error) {
    console.error('❌ Erreur upload multiple:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur lors de l\'upload multiple , merci',
      details: error.message 
    });
  }
});

// 4. ROUTE POUR MAIN IMAGE + GALLERY (ancienne route multiple)
router.post('/multiple', upload.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'galleryImages', maxCount: 10 }
]), async (req, res) => {
  console.log('📤 Upload multiple avec champs spécifiques');
  
  try {
    const results = {};

    // Upload mainImage
    if (req.files.mainImage) {
      console.log('📸 Upload mainImage...');
      const mainResult = await uploadToCloudinary(
        req.files.mainImage[0].buffer,
        'yayoh-sante/products/main'
      );
      results.mainImage = mainResult.secure_url;
    }

    // Upload galleryImages
    if (req.files.galleryImages) {
      console.log('🖼️  Upload galleryImages...');
      const galleryPromises = req.files.galleryImages.map(file =>
        uploadToCloudinary(file.buffer, 'yayoh-sante/gallery')
      );
      const galleryResults = await Promise.all(galleryPromises);
      results.galleryImages = galleryResults.map(r => r.secure_url);
    }

    res.json({
      success: true,
      message: 'Images uploadées sur Cloudinary',
      urls: results
    });

  } catch (error) {
    console.error('❌ Erreur upload multiple:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// ========== MIDDLEWARE DE LOG ==========
router.use((req, res, next) => {
  console.log(`📥 [${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// 4. ROUTE POUR UPLOAD DE VIDÉOS - VERSION CORRIGÉE
router.post('/videos', upload.single('video'), async (req, res) => {
  console.log('🎬 Upload vidéo appelé');
  
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        error: 'Aucune vidéo fournie' 
      });
    }

    // Vérifie que c'est une vidéo
    if (!req.file.mimetype.startsWith('video/')) {
      return res.status(400).json({
        success: false,
        error: 'Format non supporté',
        details: 'Veuillez uploader un fichier vidéo (MP4, MOV, etc.)'
      });
    }

    // Utilise la fonction existante
    const result = await uploadToCloudinary(
      req.file.buffer,
      'yayoh-sante/videos'
    );

    // Réponse simple
    res.json({
      success: true,
      video: {
        url: result.secure_url,
        public_id: result.public_id,
        format: result.format || 'mp4'
      },
      message: result.message || 'Vidéo uploadée'
    });

  } catch (error) {
    console.error('❌ Erreur:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur d\'upload',
      details: error.message
    });
  }
});

export default router;

