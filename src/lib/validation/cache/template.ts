import { z } from "zod";
import { templateSchema } from "../templates";

export const cachedTemplateSchema = templateSchema;

export type CachedTemplateData = z.infer<typeof cachedTemplateSchema>;
