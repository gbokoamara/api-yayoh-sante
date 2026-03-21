
import express from "express";
import {
  addTestimonial,
  getAllTestimonial,
  getProfil,
  updateTestimonial,
  userlogin,
  userRegister,
  validateTestimonial,
  getProductTestimonials,
} from "../../controllers/v1/yayoh.controller.js";
import { protect } from "../../middleware/auth.js";

const router = express.Router();

router.post("/register", userRegister);
router.post("/login", userlogin);
router.get("/profil", protect, getProfil);
router.post("/testimonial", addTestimonial);
router.get("/testimonial", getAllTestimonial);
router.get("/testimonials/:productId", getProductTestimonials);
router.put("/testimonial/:id", updateTestimonial);
router.put("/testimonial/validate/:id", validateTestimonial);

export default router;
