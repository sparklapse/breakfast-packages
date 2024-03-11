import { z } from "zod";
import type { ComponentType } from "svelte";

export const pluginType = z.object({
  id: z.string(),
  name: z.string(),
  version: z.string(),
  author: z.string(),
});

export type Plugin = z.infer<typeof pluginType>;

export const pluginAssetType = pluginType.extend({
  script: z.string(),
});

export type PluginAsset = z.infer<typeof pluginAssetType>;

export const pluginComponentType = z.object({
  id: z.string(),
  label: z.string(),
  component: z.custom<ComponentType>(() => true),
  editor: z.custom<ComponentType>(() => true).optional(),
  defaults: z.record(z.any()).default({}),
  module: z
    .object({
      id: z.string(),
      name: z.string().optional(),
    })
    .optional(),
});

export type PluginComponent = z.infer<typeof pluginComponentType>;

export const pluginModuleType = pluginType.extend({
  components: pluginComponentType.array().default([]),
});

export type PluginModule = z.infer<typeof pluginModuleType>;
