# AI Support Service

Este projeto é uma API de chatbot baseada em RAG (Retrieval-Augmented Generation), capaz de responder a perguntas de clientes utilizando um conjunto de dados aprimorados (IDS) com suporte a múltiplos projetos.

---

## Funcionalidades

- Integração com OpenAI (GPT-4) para respostas contextuais
- Geração de embeddings
- Busca semântica no Azure AI Search
- Lógica de repasse para humano
- Estrutura preparada para múltiplos clientes (ex: Tesla)

---

## Como executar o projeto

### 1. Clone o repositório

```
$ git clone git@github.com:Fernandasacosta/ai-support.git
$ cd ai-support
```

### 2. Crie um arquivo .env

```
$ cp .env.example .env
```

### 3. Instale as dependencias

```
$ npm install
```

### 4. Configure o arquivo .env

```
OPENAI_API_KEY=sua_chave_openai
AZURE_AI_SEARCH_KEY=sua_chave_azure
```

### 5. Inicie o servidor localmente

```
$ npm run dev
```

## Como executar com o Docker

```
$ docker-compose build
```

---

## Principais decisões técnicas

### 1. Regra de Negócio — Opção 2: Recurso de transferência

Durante meus testes, ao realizar perguntas muito fora do escopo do que estava disponível no IDS, os resultados com maior score retornados pela busca semântica estavam classificados como `type: N2`.

Com base nisso, decidi implementar a Opção 2, que trata do escalonamento automático quando houver conteúdo do tipo N2. Nesse caso, optei por **não** fazer a chamada para o OpenAI, retornando uma mensagem automática que redireciona o usuário para atendimento humano.

### 2. Validação do parâmetro `projectName`

A ideia inicial era criar o projeto apenas para a cliente Tesla. Visando uma possível implementação para outros clientes, decidi validar um conjunto de projetos permitidos. Atualmente, esse conjunto consiste apenas em `tesla_motors`, mas pode ser expandido futuramente. Assim, quando surgirem outros clientes, não haverá erros no serviço de busca semântica.

---

## Propostas de evolução

### 1. Arquitetura

Para este projeto, dado o tamanho do escopo e considerando possíveis atualizações, optei por uma arquitetura compacta, com a seguinte estrutura de pastas:

```
├───controllers     # Regras de negócio
├───middlewares     # Validação de payload
├───routes
├───services        # Serviços externos
│   ├───openAi      # Gerar embeddings, gerar resposta
│   └───vectorDb    # Busca semântica
└───validations     # Definição de schemas
```

Como proposta de melhoria, adicionaria um middleware de tratamento de erros, assim como um middleware de autorização. Também retiraria a regra de negócio do controller e a moveria para um `useCase`.

### 2. Validação do `projectName`

Como mencionado anteriormente, a validação do `projectName` foi implementada diretamente no `zod`, por motivos de simplicidade. No entanto, isso se torna inviável à medida que o número de projetos cresce. Portanto, sugiro criar um middleware ou incorporar, na regra de negócio, uma verificação em banco de dados para validar se o projeto é de fato permitido.

---
