import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import {
  createSuperAdmin,
  deleteAuctionItem,
  deletePaymentProof,
  fetchAllUsers,
  getAllPaymentProofs,
  getPaymentProofDetail,
  monthlyRevenue,
  updateProofStatus,
} from "../controllers/superAdminController.js";

const router = express.Router();

// Route to create a Super Admin
router.post(
  "/createsuperadmin",
  isAuthenticated, // Optional: Only authenticated users can create a Super Admin
  isAuthorized("Super Admin"), // Optional: Only another Super Admin can create a new one
  createSuperAdmin
);

router.delete(
  "/auctionitem/delete/:id",
  isAuthenticated,
  isAuthorized("Super Admin"),
  deleteAuctionItem
);

router.get(
  "/paymentproofs/getall",
  isAuthenticated,
  isAuthorized("Super Admin"),
  getAllPaymentProofs
);

router.get(
  "/paymentproof/:id",
  isAuthenticated,
  isAuthorized("Super Admin"),
  getPaymentProofDetail
);

router.put(
  "/paymentproof/status/update/:id",
  isAuthenticated,
  isAuthorized("Super Admin"),
  updateProofStatus
);

router.delete(
  "/paymentproof/delete/:id",
  isAuthenticated,
  isAuthorized("Super Admin"),
  deletePaymentProof
);

router.get(
  "/users/getall",
  isAuthenticated,
  isAuthorized("Super Admin"),
  fetchAllUsers
);

router.get(
  "/monthlyincome",
  isAuthenticated,
  isAuthorized("Super Admin"),
  monthlyRevenue
);

export default router;
