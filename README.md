# RAG Chat API

Este projeto é uma API de chatbot baseada em RAG (Retrieval-Augmented Generation), capaz de responder a perguntas de clientes utilizando uma base de conhecimento (IDS) com suporte a múltiplos projetos.  

---

##  Funcionalidades

- Integração com OpenAI (GPT-4) para respostas contextuais
- Geração de embeddings 
- Busca semântica no Azure AI Search
- Lógica de repasse para humano ou solicitação de esclarecimento
- Estrutura preparada para múltiplos clientes (ex: Tesla)

---

##  Estrutura do Projeto

src/
├── controllers/ # Lógica principal do endpoint
├── routes/ # Definição das rotas
├── services/ # Integrações com APIs externas (OpenAI, Azure)
├── logic/ # Regras de negócios (ex: handover ou esclarecimento)
├── utils/ # Funções auxiliares (ex: montagem de contexto)
└── index.js # Ponto de entrada da aplicação

##  Como executar o projeto

### 1. Clone o repositório

git clone git@github.com:seu-usuario/ai-support-service.git
cd ai-support-service

### 2. Isntale as depedencias

npm install

### 3. Configure o arquivo .env

OPENAI_API_KEY=sua_chave_openai
AZURE_AI_SEARCH_KEY=sua_chave_azure
PORT=3000

### 4. Inicie o serivod localmente

npm start


## Como executar o Docker

