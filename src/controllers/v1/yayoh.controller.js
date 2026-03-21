// server/src/controllers/adminController.js

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};



// ================= REGISTER =================
export const userRegister = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, addresses } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phone,
        addresses,           // optionnel mais fourni ici
        role: "CUSTOMER",    // correspond à l'enum
      },
    });

    const token = generateToken(user);

    res.status(201).json({
      user,
      token,
    });
  } catch (error) {
    console.log("Prisma Error:", error);
    res.status(500).json({ message: "Erreur register", error });
  }
};



// ================= LOGIN =================
export const userlogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ message: "Utilisateur introuvable" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }

    const token = generateToken(user);

    res.json({
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur login", error });
  }
};



// Profil admin
export const getProfil = async (req, res) => {
  try {
    const userId = req.params.id
    const user = await prisma.user.findUnique({
      where: { id: userId },
      
    });

    if (!user) {
      return res.status(404).json({ error: 'user non trouvé' });
    }

    res.json(user);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// ================= ADD TESTIMONIAL =================
export const addTestimonial = async (req, res) => {
  try {
    const { productId } = req.params;

    const {
      name,
      location,
      text,
      rating,
      avatar,
      videoUrl
    } = req.body;

    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        location,
        text,
        rating,
        avatar,
        videoUrl,
        productId
      }
    });

    res.status(201).json({
      success: true,
      testimonial
    });

  } catch (error) {
    res.status(500).json({
      message: "Erreur ajout testimonial",
      error: error.message
    });
  }
};



// ================= GET ALL TESTIMONIALS =================
export const getAllTestimonial = async (req, res) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: "Erreur récupération testimonials", error });
  }
};


// ================= GET TESTIMONIALS BY PRODUCT =================
export const getProductTestimonials = async (req, res) => {
  try {
    const { productId } = req.params;

    const testimonials = await prisma.testimonial.findMany({
      where: {
        productId
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    res.json({
      success: true,
      testimonials
    });

  } catch (error) {
    res.status(500).json({
      message: "Erreur récupération testimonials",
      error: error.message
    });
  }
};


// ================= UPDATE TESTIMONIAL =================
export const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    const testimonial = await prisma.testimonial.update({
      where: { id: Number(id) },
      data: { message },
    });

    res.json(testimonial);
  } catch (error) {
    res.status(500).json({ message: "Erreur update testimonial", error });
  }
};



// ================= VALIDATE TESTIMONIAL =================
export const validateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const testimonial = await prisma.testimonial.update({
      where: { id: Number(id) },
      data: { isValid: true },
    });

    res.json(testimonial);
  } catch (error) {
    res.status(500).json({ message: "Erreur validation testimonial", error });
  }
};