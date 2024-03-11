import { z } from "zod";

export const transformType = z.object({
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
});

export type Transform = z.infer<typeof transformType>;

export const sceneSourceType = z.object({
  component: z.object({
    id: z.string(),
    module: z.string().optional(),
  }),
  transform: transformType,
  data: z.record(z.any()),
});

export type SceneSource = z.infer<typeof sceneSourceType>;

export const sceneType = z.object({
  label: z.string(),
  sources: z.tuple([z.string(), sceneSourceType]).array(),
});

export type Scene = z.infer<typeof sceneType>;
