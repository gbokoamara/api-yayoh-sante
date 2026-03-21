
import { PrismaClient } from "@prisma/client";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

// const generateToken = (user) => {
//   return jwt.sign(
//     { id: user.id, role: user.role },
//     process.env.JWT_SECRET,
//     { expiresIn: "7d" }
//   );
// };



// ================= ADD TESTIMONIAL =================

export const addTestimonial = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

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
        productId,
        userId
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
      orderBy: { createdAt: "desc" },
    });
    // console.log(testimonials)
    res.json({testimonials});
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

// ================= GET User TESTIMONIALS =================
export const getUserTestimonial = async (req, res) => {
  const {userId} = req.params;
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { userId},
      orderBy: { createdAt: "desc" },
    });

    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: "Erreur récupération testimonials", error });
  }
};


// ================= UPDATE TESTIMONIAL =================
export const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    const testimonial = await prisma.testimonial.update({
      where: { id: id },
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
      where: { id: id },
      data: { approved: true },
    });

    res.json(testimonial);
  } catch (error) {
    res.status(500).json({ message: "Erreur validation testimonial", error });
  }
};

// ================= VALIDATE TESTIMONIAL =================
export const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const testimonial = await prisma.testimonial.delete({
      where: { id: id },
    //   data: { isDelete: true },
    });

    res.json({message: "temoignage supprimé avec success !"});
  } catch (error) {
    res.status(500).json({ message: "Erreur validation testimonial", error });
  }
};