import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { v2 as cloudinary } from "cloudinary";
import { generateToken } from "../utils/jwtToken.js";

// Register User
export const register = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Profile Image Required.", 400));
  }

  const { profileImage } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(profileImage.mimetype)) {
    return next(new ErrorHandler("File format not supported.", 400));
  }

  const {
    userName,
    email,
    password,
    phone,
    address,
    role,
    bankAccountNumber,
    bankAccountName,
    bankName,
    easypaisaAccountNumber,
    paypalEmail,
  } = req.body;

  // Validate required fields
  if (!userName || !email || !phone || !password || !address || !role) {
    return next(new ErrorHandler("Please fill full form.", 400));
  }

  // Additional validation for "Auctioneer" role
  if (role === "Auctioneer") {
    if (!bankAccountName || !bankAccountNumber || !bankName) {
      return next(new ErrorHandler("Please provide full bank details.", 400));
    }
    if (!easypaisaAccountNumber) {
      return next(new ErrorHandler("Please provide your Easypaisa account number.", 400));
    }
    if (!paypalEmail) {
      return next(new ErrorHandler("Please provide your PayPal email.", 400));
    }
  }

  // Check if the user is already registered
  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler("User already registered.", 400));
  }

  // Upload profile image to Cloudinary
  const cloudinaryResponse = await cloudinary.uploader.upload(profileImage.tempFilePath, {
    folder: "MERN_AUCTION_PLATFORM_USERS",
  });

  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error("Cloudinary error:", cloudinaryResponse.error || "Unknown error.");
    return next(new ErrorHandler("Failed to upload profile image to Cloudinary.", 500));
  }

  // Create new user
  const user = await User.create({
    userName,
    email,
    password,
    phone,
    address,
    role,
    profileImage: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
    paymentMethods: {
      bankTransfer: {
        bankAccountNumber,
        bankAccountName,
        bankName,
      },
      easypaisa: {
        easypaisaAccountNumber,
      },
      paypal: {
        paypalEmail,
      },
    },
  });

  // Generate JWT token and send response
  generateToken(user, "User Registered.", 201, res);
});

// Login User
export const login = catchAsyncErrors(async (req, res, next) => {
  console.log("Login request body:", req.body); // Add this line

  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return next(new ErrorHandler("Please fill full form.", 400));
  }

  // Check if user exists
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid credentials.", 400));
  }

  // Check if the password matches
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid credentials.", 400));
  }

  // Generate JWT token and send response
  generateToken(user, "Login successfully.", 200, res);
});


// Get User Profile
export const getProfile = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;

  res.status(200).json({
    success: true,
    user,
  });
});

// Logout User
export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Logout Successfully.",
    });
});

// Fetch Leaderboard
export const fetchLeaderboard = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find({ moneySpent: { $gt: 0 } });
  const leaderboard = users.sort((a, b) => b.moneySpent - a.moneySpent);

  res.status(200).json({
    success: true,
    leaderboard,
  });
});
