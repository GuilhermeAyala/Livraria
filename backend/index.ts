import express from "express";
import cors from "cors";
import booksRouter from "./routes/booksRoutes";
import userRouter from "./routes/userRoutes";
import authRouter from "./routes/authRoutes";
import accountRouter from "./routes/accountRoutes";
import orderRouter from "./routes/orderRoutes";

export const app = express();
const port = 4000;

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.get("/", (_req, res) => {
  res.json({ message: "Backend da livraria rodando" });
});

app.use("/books", booksRouter);
app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/me", accountRouter);
app.use("/orders", orderRouter);

if (require.main === module) {
  app.listen(port, () =>{
    console.log(`Servidor backend rodando na porta ${port}`);
  });
}
