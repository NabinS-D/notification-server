import express from "express";
import dotenv from "dotenv";
import notificationRoutes from "./routes/notifications.js";
import cors from "cors";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
// Routes

app.use("/api", notificationRoutes);

// Basic route for testing
app.get("/", (req, res) => {
  res.send("Notification server is running!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
