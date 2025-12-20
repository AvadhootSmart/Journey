import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth.route.js";
import { journalRouter } from "./routes/journal.route.js";
import { userRouter } from "./routes/user.route.js";
import { entryRouter } from "./routes/entry.route.js";


const app = express();
const PORT = 8000;

app.use(cors({ origin: process.env.PROD_URL, credentials: true, methods: ["GET", "POST", "PUT", "DELETE"], allowedHeaders: ["Content-Type", "Authorization"] }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World 1234!");
});

app.use("/auth", authRouter);
app.use("/journal", journalRouter);
app.use("/user", userRouter)
app.use("/entry", entryRouter)

// Only start the server in development mode
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log("Server started on port " + PORT);
  });
}

export default app;
