import express from 'express';
import type { Request,  Response } from 'express'
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.post('/api/books', async (req: Request, res: Response) => {
  const { produto, price, autor, ano, quantidade } = req.body;
  try {
    const livro = await prisma.livro.create({
      data: { produto, price, autor, ano, quantidade }
    });
    res.status(201).json(livro);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao adicionar livro', detalhes: error });
  }
});

app.listen(3000, () => {
  console.log('🚀 Backend rodando em http://localhost:3000');
});