import express from 'express';
import mongoose from "mongoose";
import cors from "cors";

const authRoutes = require("./routes/auth");
const todoRoutes = require("./routes/todo");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/todo", todoRoutes);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

mongoose.connect('MONGO_URL');