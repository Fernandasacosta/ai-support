import express from "express";
import { completionsSchema } from "./validations/completions";
import { getEmbeddings } from "./services/openAi";
import { getSemanticSearch } from "./services/vectorDb";

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

app.post("/conversations/completions", async (req, res) => {
  const validatedBody = completionsSchema.safeParse(req.body);

  if (validatedBody.error) {
    return res.status(400).json({ error: validatedBody.error.message });
  }

  const { projectName, messages } = validatedBody.data;

  const lastUserMessage = messages[validatedBody.data.messages.length - 1];

  if (lastUserMessage.role !== "USER") {
    return res
      .status(400)
      .json({ error: "A última mensagem deve ser do usuário" });
  }

  try {
    const { data: embeddingsData } = await getEmbeddings(
      lastUserMessage.content
    );

    const embeddings = embeddingsData.data[0].embedding;

    const { data: semanticSearch } = await getSemanticSearch({
      embeddings,
      projectName,
    });
  } catch {
    return res.status(500).json({ error: "Erro interno do servidor" });
  }

  res.send("API funcionando!");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
