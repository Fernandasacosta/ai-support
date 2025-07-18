import axios from "axios";
import { SemanticSearch } from "./types";

const AZURE_AI_SEARCH_KEY = process.env.VECTOR_DB_KEY;

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
        "api-key": AZURE_AI_SEARCH_KEY,
      },
    }
  );

export { getSemanticSearch };
