

// src/routes/adminRoutes.js
import express from 'express';
import { loginAdmin, getAdminProfile } from '../controllers/adminController.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Authentification admin
// router.post('/login', loginAdmin);
router.get('/profile', authenticateAdmin, getAdminProfile);

export default router;

