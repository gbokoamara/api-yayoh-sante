
import express from "express";
import {
  addTestimonial,
  getAllTestimonial,
  updateTestimonial,
  validateTestimonial,
  getProductTestimonials,
  deleteTestimonial,
  getUserTestimonial
} from "../../controllers/v1/testimonial.controller.js";

import { protect } from "../../middleware/auth.js";

const router = express.Router();

router.post("/product/:productId", protect, addTestimonial);
router.get("/getUser/:userId",  getUserTestimonial);
router.get("/getAll", getAllTestimonial);
router.get("/get/:productId", getProductTestimonials);
router.put("/update/:id", updateTestimonial);
router.put("/validate/:id", validateTestimonial);
router.delete("/delete/:id", deleteTestimonial);


export default router;
