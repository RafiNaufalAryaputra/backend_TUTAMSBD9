const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://frontend-tutamsbd-9.vercel.app/"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

const TodoSchema = new mongoose.Schema({
  text: { type: String, required: true },
  day: { type: String, required: true },
  completed: { type: Boolean, default: false },
});
const Todo = mongoose.model("Todo", TodoSchema);

// Routes

app.get("/api/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new todo
app.post("/api/todos", async (req, res) => {
  try {
    console.log("📥 POST /api/todos:", req.body); // 👈 debug log
    const { text, day } = req.body;
    const newTodo = new Todo({ text, day });
    const saved = await newTodo.save();
    res.json(saved);
  } catch (err) {
    console.error("❌ POST error:", err.message); // 👈 debug log
    res.status(400).json({ message: err.message });
  }
});

// DELETE todo
app.delete("/api/todos/:id", async (req, res) => {
  try {
    console.log("🗑️ DELETE /api/todos/:id", req.params.id); // 👈 debug log
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "Todo deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update todo
app.put("/api/todos/:id", async (req, res) => {
  try {
    console.log("🔁 PUT /api/todos/:id", req.params.id, req.body); // 👈 debug log
    const { completed } = req.body;
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      { completed },
      { new: true }
    );
    res.json(updatedTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on PORT ${PORT}`);
});
