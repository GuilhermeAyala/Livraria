# IDEIAS DO PROJETO E ORGANIZAÇÕES GERAIS
# Livraria

Projeto de uma aplicação de livraria online, desenvolvido inicialmente com foco no frontend em React. A aplicação permite visualizar livros, pesquisar títulos, adicionar itens ao carrinho, favoritar livros e simular um fluxo de pagamento.

Aplicação funcional(backend e frontend), com escopo para futuras melhorias.

## Status do Projeto

Frontend: funcional  
Backend: funcional

## Tecnologias Utilizadas

### Frontend
- React
- Vite
- React Router DOM
- TypeScript
- Context API
- CSS

### Backend
- Node.js
- Express
- TypeScript
- Prisma
- PostgreSQL

## Funcionalidades Atuais
- Login inicial simples
- Listagem de livros
- Busca de livros por nome
- Adição de livros ao carrinho
- Alteração de quantidade no carrinho
- Remoção de itens do carrinho
- Cálculo de subtotal da compra
- Detalhes da compra
- Favoritar livros
- Persistência local de carrinho e favoritos com LocalStorage
- Tela de pagamento com opções simuladas
- Simulação de desconto por método de pagamento
- Geração de código de barras para boleto

## Classes:
-Books
-Users
-Pagamento
-Order/Pedidos

## Arquitetura: 
-MVC moderno com Model, View, Controller, Service, Routes, Repository. 

## Organização do Frontend
A pasta `src` está organizada da seguinte forma:
src/
  components/
  contexts/
  data/
  models/
  pages/

## Organização Backend
backend/ 
  constants/
  controllers/
  middleware/
  models/
  prisma/
  repositories/
  routes/
  services/
  tests/
  
## Subir backend 
cd backend
npm run dev

## Subir frontend
cd src
npm run dev
