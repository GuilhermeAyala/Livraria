import express from "express";
import booksRouter from "./routes/booksRoutes";
import userRouter from "./routes/userRoutes";

const app = express();
const port = 4000;

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Backend da livraria rodando" });
});

app.use("/books", booksRouter);
app.use("/users", userRouter);

app.listen(port, () =>{
  console.log(`Servidor backend rodando na porta ${port}`);
});
