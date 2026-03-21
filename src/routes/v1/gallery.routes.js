import express from "express";
import { protect } from "../../middleware/auth.js";
import { 
  addGallery, 
  getAllGallery, 
  getProductGalleries,
  updateGallery,
  updateGalleryOrder,
  deleteGallery 
} from "../../controllers/v1/gallery.controller.js";

const router = express.Router();

router.post("/add", protect, addGallery);
router.get("/getAll", getAllGallery);
router.get("/product/:productId", getProductGalleries);
router.put("/update/:id", protect, updateGallery);
router.put("/order/:id", protect, updateGalleryOrder);
router.delete("/delete/:id", protect, deleteGallery);

export default router;