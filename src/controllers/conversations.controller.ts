import { Request, Response } from "express";
import z from "zod";
import { getCompletions, getEmbeddings } from "../services/openAi";
import { getSemanticSearch } from "../services/vectorDb";
import { completionsSchema } from "../validations/completions";

/**
 * Handles a conversation completion request by generating an AI response based on the latest user message.
 *
 * This controller:
 * 1. Receives an already validated request body.
 * 2. Extracts the last message and ensures it was sent by the user.
 * 3. Generates embeddings for the message content.
 * 4. Performs a semantic search using the embeddings and project name.
 * 5. Decides whether to respond using the AI assistant or hand off to a human based on the top result.
 * 6. Returns a response containing the updated message history, handover flag, and retrieved sections.
 *
 * @param req - Express request object, expected to contain a body matching `completionsSchema`.
 * @param res - Express response object used to return the result or an error.
 *
 * @returns A JSON response with:
 * - `messages`: Updated message array including the AI or handover message.
 * - `handoverToHumanNeeded`: Boolean indicating if the user should be routed to a human.
 * - `sectionsRetrieved`: Relevant sections retrieved from the semantic search, including score and content.
 *
 * @throws 400 - If the last message is not from the user.
 * @throws 500 - For any unexpected internal errors.
 */
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
