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
import uploadRoutes from './routes/uploadRoutes.js';
import userRoutes from './routes/v1/yayoh.routes.js';
import testimonialRoutes from './routes/v1/testimonial.routes.js'
import galleryRoutes from './routes/v1/gallery.routes.js'

app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/auth', userRoutes);
app.use('/api/testimonial', testimonialRoutes);
app.use('/api/gallery', galleryRoutes);

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});


// app.post('/api/admin/login', (req, res) => {
//   const { email, password } = req.body;
//   if (email === 'admin@indigenat.com' && password === 'admin123') {
//     res.json({ token: 'admin-token', admin: { email, name: 'Admin' } });
//   } else {
//     res.status(401).json({ error: 'Identifiants incorrects' });
//   }
// });

app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`🚀 Serveur démarré: http://localhost:${PORT}`);
  console.log(`📁 Dossier uploads: ${path.join(__dirname, '../uploads')}`);
  console.log(`📤 Uploads: http://localhost:${PORT}/uploads/`);
  console.log(`📦 Produit: http://localhost:${PORT}/api/products/main`);
  console.log(`👤 Admin: http://localhost:${PORT}/api/admin/login`);
  console.log(`📤 API Upload: http://localhost:${PORT}/api/upload`);
  console.log(`📤 API Upload: http://localhost:${PORT}api/auth`);
  console.log('='.repeat(50));
});
