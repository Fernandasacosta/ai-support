import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";

const validationMiddleware =
  (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ error: result.error.message });
    }

    req.body = result.data;
    next();
  };

export default validationMiddleware;
