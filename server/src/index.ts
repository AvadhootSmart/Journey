import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth.route.ts";
import { journalRouter } from "./routes/journal.route.ts";
import { userRouter } from "./routes/user.route.ts";
import { entryRouter } from "./routes/entry.route.ts";


const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World 1234!");
});

app.use("/auth", authRouter);
app.use("/journal", journalRouter);
app.use("/user", userRouter)
app.use("/entry", entryRouter)

app.listen(8000, () => {
  console.log("Server started on port 8000");
});
