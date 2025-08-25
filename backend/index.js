//package
import path from "path";
import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // Add this line
dotenv.config();
import cookieParser from "cookie-parser";
import categoryRoutes from "./routes/categoryRoutes.js"

//utiles
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import uploadRoutes from "./routes/uploadRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"

const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

// Add the CORS configuration here
const frontendURL = 'https://mern-e-commerce-store-black.vercel.app';
app.use(cors({ origin: frontendURL }));


app.use((req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    // First, check if req.body is undefined or null
    if (!req.body || Object.keys(req.body).length === 0) {
      // If the body is missing or empty, explicitly set it to an empty object
      req.body = {};
    }
  }
  next();
});

app.use("/api/users", userRoutes)
app.use("/api/category" , categoryRoutes)
app.use("/api/products", productRoutes)
app.use("/api/upload", uploadRoutes)
app.use("/api/orders" , orderRoutes)

app.get("/api/config/paypal" , (req,res) =>{
  res.send({clientId: process.env.PAYPAL_CLIENT_ID})
})

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname , "/uploads")));

app.listen(port , () => console.log(`server is running on port : ${port}`)
);