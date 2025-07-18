type SemanticSearch = {
  "@odata.context": string;
  "@odata.count": number;
  value: Array<{
    "@search.score": number;
    content: string;
    type: string;
  }>;
};

export type { SemanticSearch };
