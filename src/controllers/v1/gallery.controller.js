import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ================= ADD GALLERY =================
export const addGallery = async (req, res) => {
  try {
    const { title, imageUrl, videoUrl, type, order, productId } = req.body;

    // Validation
    if (!title || !productId) {
      return res.status(400).json({
        message: "Titre et productId sont requis"
      });
    }

    if (!imageUrl && !videoUrl) {
      return res.status(400).json({
        message: "imageUrl ou videoUrl est requis"
      });
    }

    const gallery = await prisma.gallery.create({
      data: {
        title,
        imageUrl: imageUrl || null,
        videoUrl: videoUrl || null,
        type: type || "image",
        order: order || 0,
        productId
      }
    });

    res.status(201).json({
      success: true,
      gallery
    });

  } catch (error) {
    console.error("Erreur addGallery:", error);
    res.status(500).json({
      message: "Erreur ajout gallery",
      error: error.message
    });
  }
};

// ================= GET ALL GALLERIES =================
export const getAllGallery = async (req, res) => {
  try {
    const galleries = await prisma.gallery.findMany({
      include: {
        product: {
          select: { id: true, title: true }
        }
      },
      orderBy: { order: "asc" },
    });
    res.json(galleries);
  } catch (error) {
    console.error("Erreur getAllGallery:", error);
    res.status(500).json({ message: "Erreur récupération galleries", error: error.message });
  }
};

// ================= GET GALLERIES BY PRODUCT =================
export const getProductGalleries = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ message: "productId est requis" });
    }

    const galleries = await prisma.gallery.findMany({
      where: {
        productId
      },
      orderBy: {
        order: "asc"
      }
    });

    res.json(galleries);

  } catch (error) {
    console.error("Erreur getProductGalleries:", error);
    res.status(500).json({
      message: "Erreur récupération galleries",
      error: error.message
    });
  }
};

// ================= UPDATE GALLERY =================
export const updateGallery = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, imageUrl, videoUrl, type, order } = req.body;

    const gallery = await prisma.gallery.update({
      where: { id: id },
      data: { 
        title,
        imageUrl: imageUrl || null,
        videoUrl: videoUrl || null,
        type,
        order
      },
    });

    res.json({
      success: true,
      gallery
    });
  } catch (error) {
    console.error("Erreur updateGallery:", error);
    res.status(500).json({ message: "Erreur update gallery", error: error.message });
  }
};

// ================= UPDATE GALLERY ORDER =================
export const updateGalleryOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { order } = req.body;

    const gallery = await prisma.gallery.update({
      where: { id: id },
      data: { order },
    });

    res.json({
      success: true,
      gallery
    });
  } catch (error) {
    console.error("Erreur updateGalleryOrder:", error);
    res.status(500).json({ message: "Erreur mise à jour ordre", error: error.message });
  }
};

// ================= DELETE GALLERY =================
export const deleteGallery = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.gallery.delete({
      where: { id: id },
    });

    res.json({ message: "Galerie supprimée avec succès !" });
  } catch (error) {
    console.error("Erreur deleteGallery:", error);
    res.status(500).json({ message: "Erreur suppression gallery", error: error.message });
  }
};