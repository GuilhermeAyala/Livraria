import express from "express";

const app = express();
const port = 4000;

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Backend da livraria rodando" });
});

app.listen(port, () =>{
  console.log(`Servidor backend rodando na porta ${port}`);
});
