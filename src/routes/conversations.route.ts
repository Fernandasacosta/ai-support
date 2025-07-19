import { Router } from "express";
import validationMiddleware from "../middlewares/validation";
import { completionsSchema } from "../validations/completions";
import { conversationCompletionController } from "../controllers/conversations.controller";
const router = Router();

router.post(
  "/completions",
  validationMiddleware(completionsSchema),
  conversationCompletionController
);

export { router as conversationsRoute };
