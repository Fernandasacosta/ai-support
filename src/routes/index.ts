import { Router } from "express";
import { conversationsRoute } from "./conversations.route";
const router = Router();

router.use("/conversations", conversationsRoute);

export { router };
