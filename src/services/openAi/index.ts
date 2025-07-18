import axios from "axios";
import { Completion, Embeddings } from "./types";
import { Message } from "../../validations/completions";

const OPEN_AI_KEY = process.env.OPEN_AI_KEY;
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
        Authorization: `Bearer ${OPEN_AI_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

const getCompletions = async (messages: Message[]) =>
  axios.post<Completion>(
    `${OPEN_AI_ENDPOINT}/chat/completions`,
    {
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "Your name is Claudia. You are a helpdesk assistant for the Tesla Motors project. You will answer questions about the project and its products. ",
        },
        ...messages,
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${OPEN_AI_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

export { getEmbeddings };
