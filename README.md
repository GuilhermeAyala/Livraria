# IDEIAS DO PROJETO E ORGANIZAÇÕES GERAIS
# Livraria

Projeto de uma aplicação de livraria online, desenvolvido inicialmente com foco no frontend em React. A aplicação permite visualizar livros, pesquisar títulos, adicionar itens ao carrinho, favoritar livros e simular um fluxo de pagamento.

O backend está em fase inicial de estruturação e ainda não representa a versão final fullstack do projeto.

## Status do Projeto

Frontend: funcional  
Backend: em desenvolvimento

## Tecnologias Utilizadas

### Frontend
- React
- Vite
- React Router DOM
- TypeScript
- Context API
- LocalStorage
- CSS

### Backend
- Node.js
- Express
- TypeScript
- Prisma
- MySQL

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
-Carrinho

## Arquitetura: 
-MVC moderno com Model, View, Controller e o Service

## Organização do Frontend
A pasta `src` está organizada da seguinte forma:
src/
  components/
  contexts/
  data/
  models/
  pages/
