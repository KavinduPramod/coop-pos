require("dotenv").config();
const express = require("express");
const userRoutes = require("./routes/userRoutes");
const receiptRoutes = require("./routes/receiptRoutes");
const customerRoutes = require("./routes/customerRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const cors = require("cors");

// connectDB();

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "API running..." });
});

app.use("/api/user", userRoutes);
app.use("/api/receipt", receiptRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/transaction", transactionRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
