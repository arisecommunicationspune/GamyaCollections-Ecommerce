const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const path = require("path");
const HOST = "0.0.0.0";

// Load environment variables
dotenv.config();


// Create Express app
const app = express();

// CORS configuration
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5173",
  "http://localhost:5174",
 "http://72.60.200.66:5000",
  "https://gamyacollections.com",
  "http://gamyacollections.com",
   "https://api.gamyacollections.com",
];
const corsOptions = {
  origin: (origin, callback) => {
    const normalized = origin ? origin.replace(/\/$/, "") : origin;
    // allow REST tools or same-origin requests with no origin
    if (!normalized || allowedOrigins.includes(normalized)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "x-access-token",
    "Cache-Control",
    "Pragma",
    "Accept",
    "Origin",
    "X-Requested-With",
  ],
  exposedHeaders: ["Cache-Control", "Pragma"],
  credentials: true,
  maxAge: 86400,
};

// Preflight handler to ensure ACAO is always present (Express v5 safe)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Vary", "Origin");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, x-access-token"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,DELETE,OPTIONS,PATCH"
    );
  }
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

app.use(cors(corsOptions)); // Handle CORS for normal requests
app.use(cookieParser());

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Custom caching for static files
// app.use(
//   express.static(path.join(__dirname, "build"), {
//     setHeaders: (res, filePath) => {
//       if (filePath.endsWith("index.html")) {
//         res.setHeader("Cache-Control", "no-cache");
//       } else {
//         res.setHeader("Cache-Control", "public, max-age=1536000, immutable");
//       }
//     },
//   })
// );

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Import Routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const subCategoryRoutes = require("./routes/subCategoryRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const issueRoutes = require("./routes/issueRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const uploadRoute = require("./routes/uploadRoutes");
const testimonialUploadRoutes = require("./routes/testimonialUploadRoutes");
const userRoutes = require("./routes/userRoutes");
const razorpayRoutes = require("./routes/razorpayRoutes");
const contactRoutes = require("./routes/contactRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");
const videoRoutes = require("./routes/videoRoutes");

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/subcategory", subCategoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoute);
app.use("/api/upload", testimonialUploadRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/users", userRoutes);
app.use("/api/razorpay", razorpayRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/videos", videoRoutes);



// -----------------------
// React Frontend Serving
// -----------------------
// ✅ Serve static files
app.use(
  express.static(path.join(__dirname, "public"), {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith("index.html")) {
        res.setHeader("Cache-Control", "no-cache");
      } else {
        res.setHeader("Cache-Control", "public, max-age=1536000, immutable");
      }
    },
  })
);

// ✅ Catch-all fallback for React Router (no regex, no crash)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});



// Test Route
app.get("/", (req, res) => {
  res.send("🚀 Server is running...");
});

// Test route for API
app.get("/api/test", (req, res) => {
  res.json({
    message: "API is working",
    timestamp: new Date().toISOString(),
    routes: [
      "GET /api/category",
      "POST /api/category",
      "GET /api/subcategory",
      "POST /api/subcategory",
    ],
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.url} not found`,
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, HOST, () => {
  console.log(`🚀 Server listening on http://${HOST}:${PORT}`);
  console.log("📋 Available routes:");
  console.log("   - GET /api/category");
  console.log("   - POST /api/category");
  console.log("   - GET /api/subcategory");
  console.log("   - POST /api/subcategory");
  console.log("   - GET /api/products");
  console.log("   - POST /api/auth/login");
  console.log("   - POST /api/auth/register");
});

console.log("PROJECT_PREFIX =", process.env.PROJECT_PREFIX);
