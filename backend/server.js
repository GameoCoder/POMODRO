require("dotenv").config();
const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT;
const authRoutes = require("./routes/authRoutes");
const sessionRoutes = require("./routes/sessionRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", authRoutes);
app.use("/sessions", sessionRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
