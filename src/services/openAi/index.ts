import axios from "axios";
import { Completion, Embeddings } from "./types";
import { Message } from "../../validations/completions";
import { SemanticSearch } from "../vectorDb/types";

const OPEN_AI_ENDPOINT = "https://api.openai.com/v1";

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

export { getEmbeddings, getCompletions };
