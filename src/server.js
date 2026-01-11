// server/src/server.js
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// IMPORTANT: Servir les fichiers uploads depuis le bon dossier
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
import productRoutes from './routes/productRoutes.js';
// import adminRoutes from './routes/adminRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

app.use('/api/products', productRoutes);
// app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Route produit principal simple (fallback)
app.get('/api/products/main', (req, res) => {
  res.json({
    id: 'default',
    title: "Yayoh",
    subtitle: "Un héritage naturel",
    description: "Un onguent traditionnel...",
    mainImage: "/uploads/baume-principal.jpg",
    images: ["/uploads/gallery-1.jpg"],
    testimonials: [],
    galleries: []
  });
});

app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@indigenat.com' && password === 'admin123') {
    res.json({ token: 'admin-token', admin: { email, name: 'Admin' } });
  } else {
    res.status(401).json({ error: 'Identifiants incorrects' });
  }
});

app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`🚀 Serveur démarré: http://localhost:${PORT}`);
  console.log(`📁 Dossier uploads: ${path.join(__dirname, '../uploads')}`);
  console.log(`📤 Uploads: http://localhost:${PORT}/uploads/`);
  console.log(`📦 Produit: http://localhost:${PORT}/api/products/main`);
  console.log(`👤 Admin: http://localhost:${PORT}/api/admin/login`);
  console.log(`📤 API Upload: http://localhost:${PORT}/api/upload`);
  console.log('='.repeat(50));
});




// // src/server.js
// import express from 'express';
// import cors from 'cors';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import dotenv from 'dotenv';

// // Routes
// import productRoutes from './routes/productRoutes.js';
// // import adminRoutes from './routes/adminRoutes.js'; // Supprimez ou commentez cette ligne
// // import uploadRoutes from './routes/uploadRoutes.js';

// dotenv.config();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors({
//     origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'],
// //   origin: process.env.FRONTEND_URL || 'http://localhost:3000',
//   credentials: true
// }));
// app.use(express.json());
// app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// // Routes API
// app.use('/api/products', productRoutes);
// // app.use('/api/admin', adminRoutes); // Supprimez ou commentez
// // app.use('/api/upload', uploadRoutes);

// // Routes d'authentification simples (si vous en avez besoin)
// app.post('/api/admin/login', (req, res) => {
//   const { email, password } = req.body;
  
//   // Simuler une authentification basique
//   if (email === 'admin@indigenat.com' && password === 'admin123') {
//     res.json({ 
//       token: 'fake-jwt-token', 
//       admin: { email, name: 'Administrateur' } 
//     });
//   } else {
//     res.status(401).json({ error: 'Identifiants incorrects' });
//   }
// });

// // Route de santé
// app.get('/api/health', (req, res) => {
//   res.json({ status: 'OK', timestamp: new Date().toISOString() });
// });

// // Route pour le produit principal
// app.get('/api/product/main', async (req, res) => {
//   try {
//     // Simuler une réponse
//     res.json({
//       title: "Baume Ancestral Nyanga",
//       subtitle: "Un héritage naturel",
//       description: "Un onguent traditionnel...",
//       mainImage: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800",
//       traditionalUse: "Usage traditionnel...",
//       testimonials: [],
//       galleries: []
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Route fallback pour upload (au cas où)
// app.post('/api/admin/upload', (req, res) => {
//   res.json({
//     success: true,
//     message: 'Upload route fonctionnelle',
//     urls: ['/uploads/placeholder.jpg']
//   });
// });

// app.listen(PORT, () => {
//   console.log(`🚀 Backend lancé sur http://localhost:${PORT}`);
//   console.log(`📁 Uploads: http://localhost:${PORT}/uploads/`);
//   console.log(`🌐 Test: http://localhost:${PORT}/api/health`);
//   console.log(`📦 Produit: http://localhost:${PORT}/api/product/main`);
// });