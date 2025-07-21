import axios from "axios";
import { Message } from "../../validations/completions";
import { SemanticSearch } from "../vectorDb/types";
import { Completion, Embeddings } from "./types";

const OPEN_AI_ENDPOINT = "https://api.openai.com/v1";

/**
 * OpenAI POST endpoint, that generates an array of embeddings for a given input string.
 * @param input - The text input to generate embeddings for.
 * @returns An `Embeddings` type object (check on `/services/openAi/types.ts`)
 */
const getEmbeddings = async (input: string) =>
  axios.post<Embeddings>(
    `${OPEN_AI_ENDPOINT}/embeddings`,
    {
      model: "text-embedding-3-large",
      input,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPEN_AI_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

/**
 * OpenAI POST endpoint, that composes a message array with a system prompt and the conversation messages,
 * using semantic search results as context for the assistant.
 *
 * @param messages - The conversation history, containing user and assistant messages.
 * @param semanticSeach - The contextual data retrieved from semantic search to guide the assistant's response.
 * @param projectName - The name of the project, used to personalize the system prompt.
 *
 * @returns A `Completion` type object (check on `/services/openAi/types.ts`)
 */
const getCompletions = async ({
  messages,
  semanticSeach,
  projectName,
}: {
  messages: Message[];
  semanticSeach: SemanticSearch["value"];
  projectName: string;
}) =>
  axios.post<Completion>(
    `${OPEN_AI_ENDPOINT}/chat/completions`,
    {
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Your name is Claudia. You are a helpdesk assistant for the ${projectName} project. You will answer questions about the project and its products. Use the following information to answer questions: ${JSON.stringify(
            semanticSeach
          )}`,
        },
        ...messages.map((m) => ({
          role: m.role === "USER" ? "user" : "assistant",
          content: m.content,
        })),
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPEN_AI_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

export { getCompletions, getEmbeddings };
