import { z } from "zod";

const messageSchema = z.object({
  role: z.enum(["USER", "AGENT"]),
  content: z.string(),
});

const completionsSchema = z.object({
  helpdeskId: z.number(),
  projectName: z.enum(["tesla_motors"]),
  messages: z.array(messageSchema),
});

type Message = z.infer<typeof messageSchema>;

export { messageSchema, completionsSchema, Message };
