import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { Auction } from "../models/auctionSchema.js";  // Corrected import for Auction model
import { PaymentProof } from "../models/commissionProofSchema.js";  // Assuming the PaymentProof model exists
import { Commission } from "../models/commissionSchema.js";  // Assuming the Commission model exists

// Create Super Admin
export const createSuperAdmin = catchAsyncErrors(async (req, res, next) => {
  const { userName, email, password, profileImage } = req.body;

  if (!userName || !email || !password || !profileImage) {
    return next(new ErrorHandler("Please provide all required fields.", 400));
  }

  // Check if the email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorHandler("Email already in use.", 400));
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new Super Admin
  const superAdmin = await User.create({
    userName,
    email,
    password: hashedPassword,
    role: "Super Admin", // Assigning the role as Super Admin
    profileImage,
  });

  res.status(201).json({
    success: true,
    message: "Super Admin created successfully.",
    superAdmin,
  });
});

// Delete Auction Item
export const deleteAuctionItem = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedItem = await Auction.findByIdAndDelete(id);  // Use Auction model instead of AuctionItem
    if (!deletedItem) {
      return res.status(404).json({ message: "Auction item not found" });
    }
    res.status(200).json({ message: "Auction item deleted successfully", data: deletedItem });
  } catch (error) {
    console.error("Error deleting auction item:", error);
    res.status(400).json({ message: "Failed to delete auction item", error: error.message });
  }
};

// Get All Payment Proofs
export const getAllPaymentProofs = async (req, res) => {
  try {
    const paymentProofs = await PaymentProof.find();  // Assuming this is how you're fetching payment proofs
    res.status(200).json({ paymentProofs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching payment proofs' });
  }
};

// Get Payment Proof Details
export const getPaymentProofDetail = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const paymentProofDetail = await PaymentProof.findById(id);
  res.status(200).json({
    success: true,
    paymentProofDetail,
  });
});

// Update Payment Proof Status
export const updateProofStatus = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { amount, status } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid ID format.", 400));
  }
  let proof = await PaymentProof.findById(id);
  if (!proof) {
    return next(new ErrorHandler("Payment proof not found.", 404));
  }
  proof = await PaymentProof.findByIdAndUpdate(
    id,
    { status, amount },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );
  res.status(200).json({
    success: true,
    message: "Payment proof amount and status updated.",
    proof,
  });
});

// Delete Payment Proof
export const deletePaymentProof = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const proof = await PaymentProof.findById(id);
  if (!proof) {
    return next(new ErrorHandler("Payment proof not found.", 404));
  }
  await proof.deleteOne();
  res.status(200).json({
    success: true,
    message: "Payment proof deleted.",
  });
});

// Fetch All Users
export const fetchAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.aggregate([
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
          role: "$role",
        },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        month: "$_id.month",
        year: "$_id.year",
        role: "$_id.role",
        count: 1,
        _id: 0,
      },
    },
    {
      $sort: { year: 1, month: 1 },
    },
  ]);

  const bidders = users.filter((user) => user.role === "Bidder");
  const auctioneers = users.filter((user) => user.role === "Auctioneer");

  const tranformDataToMonthlyArray = (data, totalMonths = 12) => {
    const result = Array(totalMonths).fill(0);

    data.forEach((item) => {
      result[item.month - 1] = item.count;
    });

    return result;
  };

  const biddersArray = tranformDataToMonthlyArray(bidders);
  const auctioneersArray = tranformDataToMonthlyArray(auctioneers);

  res.status(200).json({
    success: true,
    biddersArray,
    auctioneersArray,
  });
});

// Monthly Revenue
export const monthlyRevenue = catchAsyncErrors(async (req, res, next) => {
  const payments = await Commission.aggregate([
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
        },
        totalAmount: { $sum: "$amount" },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 },
    },
  ]);

  const tranformDataToMonthlyArray = (payments, totalMonths = 12) => {
    const result = Array(totalMonths).fill(0);

    payments.forEach((payment) => {
      result[payment._id.month - 1] = payment.totalAmount;
    });

    return result;
  };

  const totalMonthlyRevenue = tranformDataToMonthlyArray(payments);
  res.status(200).json({
    success: true,
    totalMonthlyRevenue,
  });
});
