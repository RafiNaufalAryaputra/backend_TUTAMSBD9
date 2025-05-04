const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// Schema & Model
const TodoSchema = new mongoose.Schema({
  text: { type: String, required: true },
  day: { type: String, required: true }, // misal: "Senin"
  completed: { type: Boolean, default: false }, // Field untuk status completed
});
const Todo = mongoose.model("Todo", TodoSchema);

// Routes

// Get all todos
app.get("/api/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new todo
app.post("/api/todos", async (req, res) => {
  try {
    const { text, day } = req.body;
    const newTodo = new Todo({ text, day });
    const saved = await newTodo.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete todo by ID
app.delete("/api/todos/:id", async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "Todo deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update todo status (completed)
app.put("/api/todos/:id", async (req, res) => {
  try {
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

// Run server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
