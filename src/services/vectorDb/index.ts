import axios from "axios";
import { SemanticSearch } from "./types";

/**
 * Azure AI Search POST endpoint, that retrieves the most relevant documents
 * based on the provided embeddings and project name.
 *
 * @param embeddings - The numerical vector representing the user's query input.
 * @param projectName - The name of the project used to filter search results.
 *
 * @returns A `SemanticSearch` type object (check on `/services/vectorDb/types.ts`)
 */
const getSemanticSearch = ({
  embeddings,
  projectName,
}: {
  projectName: string;
  embeddings: number[];
}) =>
  axios.post<SemanticSearch>(
    "https://claudia-db.search.windows.net/indexes/claudia-ids-index-large/docs/search?api-version=2023-11-01",
    {
      count: true,
      select: "content, type",
      top: 10,
      filter: `projectName eq '${projectName}'`,
      vectorQueries: [
        {
          vector: embeddings,
          k: 3,
          fields: "embeddings",
          kind: "vector",
        },
      ],
    },
    {
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.VECTOR_DB_KEY,
      },
    }
  );

export { getSemanticSearch };
