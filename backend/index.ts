import express from "express";
import router from "../backend/routes/booksRoutes"

const app = express();
const port = 4000;

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Backend da livraria rodando" });
});

app.use('/books', router);

app.listen(port, () =>{
  console.log(`Servidor backend rodando na porta ${port}`);
});
