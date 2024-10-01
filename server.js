const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sequelize = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const clientRoutes = require("./routes/clientRoutes");
const userRoutes = require("./routes/userRoutes");
const misRoutes = require("./routes/misRoutes");
const panRouter = require("./routes/panRouter.js");
const socketIO = require("socket.io");
const path = require("path");
const morgan = require("morgan");
require("dotenv").config();

const PORT = process.env.PORT || 3001;
const app = express();

// Middleware
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(morgan("dev"));

// Define routes
app.use("/api/auth", authRoutes);
app.use("/api/client", clientRoutes);
app.use("/api/user", userRoutes);
app.use("/api/report", misRoutes);
app.use("/api/panvalidation", panRouter);

// Serve static files from the Vite build
app.use(express.static(path.join(__dirname, "client/build")));
// Catch-all route to serve index.html for SPA routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build/index.html"));
});
// Sync the Sequelize models with the database
sequelize
  .sync()
  .then(() => {
    console.log("Database synced");
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    // Initialize Socket.IO
    const io = socketIO(server, {
      cors: {
        origin: "*",
        methods: ["GET"],
        credentials: true,
      },
    });
    // Attach io to the app instance
    app.set("io", io);
    // Handle socket connections
    io.on("connection", (socket) => {
      console.log("New client connected");

      socket.on("update", (data) => {
        io.emit("refreshData", data);
      });

      // Handle disconnection
      socket.on("disconnect", () => {
        console.log("Client disconnected");
      });
    });
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });
// Create server and attach Socket.IO
