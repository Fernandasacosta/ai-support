import z from "zod";
import { getCompletions, getEmbeddings } from "../services/openAi";
import { getSemanticSearch } from "../services/vectorDb";
import { completionsSchema } from "../validations/completions";
import { Request, Response } from "express";

const conversationCompletionController = async (
  req: Request,
  res: Response
) => {
  const validatedBody = req.body as z.infer<typeof completionsSchema>;

  const { projectName, messages } = validatedBody;

  const lastUserMessage = messages[validatedBody.messages.length - 1];

  if (lastUserMessage.role !== "USER") {
    return res.status(400).json({ error: "Last message should be from user" });
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

    const highestScoreResult = semanticSearch.value.reduce((max, item) =>
      item["@search.score"] > max["@search.score"] ? item : max
    );

    if (highestScoreResult.type === "N2") {
      return res.json({
        messages: [
          ...messages,
          {
            role: "AGENT",
            content:
              "I cannot answer that, will now be passing the conversation to a human",
          },
        ],
        handoverToHumanNeeded: true,
        sectionsRetrieved: semanticSearch.value.map((s) => ({
          score: s["@search.score"],
          content: s.content,
        })),
      });
    } else {
      const { data: completionsData } = await getCompletions({
        messages,
        semanticSeach: semanticSearch.value,
        projectName,
      });

      return res.json({
        messages: [
          ...messages,
          {
            role: "AGENT",
            content: completionsData.choices[0].message.content,
          },
        ],
        handoverToHumanNeeded: false,
        sectionsRetrieved: semanticSearch.value.map((s) => ({
          score: s["@search.score"],
          content: s.content,
        })),
      });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export { conversationCompletionController };
