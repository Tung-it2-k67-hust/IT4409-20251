const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

mongoose
 .connect("mongodb+srv://20225425:20225425@cluster0.ylfdlmx.mongodb.net/it4409?appName=Cluster0")
 .then(() => console.log("Connected to MongoDB"))
 .catch((err) => console.error("MongoDB Error:", err));

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
  role: String,
  address: String
});
const User = mongoose.model("User", UserSchema);

app.get("/api/users", async (req, res) => {
 try {
 const page = parseInt(req.query.page) || 1;
 const limit = parseInt(req.query.limit) || 5;
 const search = req.query.search || "";
 const filter = search
 ? {
 $or: [
 { name: { $regex: search, $options: "i" } },
 { email: { $regex: search, $options: "i" } },
 { address: { $regex: search, $options: "i" } }
 ]
 }
 : {};
 const skip = (page - 1) * limit;
 const users = await User.find(filter)
 .skip(skip)
 .limit(limit);
 const total = await User.countDocuments(filter);
 const totalPages = Math.ceil(total / limit);
 res.json({
 page,
 limit,
 total,
 totalPages,
 data: users
 });
 } catch (err) {
 res.status(500).json({ error: err.message });
 }
});

// app.post("/api/users", async (req, res) => { ... });
// app.put("/api/users/:id", async (req, res) => { ... });
// app.delete("/api/users/:id", async (req, res) => { ... });

app.listen(3001, () => {
 console.log("Server running on http://localhost:3001");
});