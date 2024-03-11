import { setContext } from "svelte";
import { derived, writable } from "svelte/store";
import type { SceneSource } from "./types";

export const provideScene = (
  initial?: Partial<{ label: string; sources: Map<string, SceneSource> }>,
) => {
  const label = writable<string>(initial?.label ?? "Untitled Scene");
  const controlledSources = writable<{ sources: Map<string, SceneSource> }>({
    sources: new Map(initial?.sources),
  });

  let autoId = 0;
  const addSource = (source: SceneSource, id?: string) => {
    controlledSources.update(({ sources }) => {
      if (!id) {
        while (sources.has(autoId.toString())) autoId++;
      } else if (sources.has(id)) {
        throw Error("Source with id already exists");
      }

      sources.set(id ?? autoId.toString(), source);
      return { sources };
    });
  };

  const updateSource = (id: string, update: (source: SceneSource) => SceneSource) => {
    controlledSources.update(({ sources }) => {
      const source = sources.get(id);
      if (source) sources.set(id, update(source));
      return { sources };
    });
  };

  const updateSources = (
    update: (sources: Map<string, SceneSource>) => Map<string, SceneSource>,
  ) => {
    controlledSources.update(({ sources }) => ({ sources: update(sources) }));
  };

  const sources = derived(controlledSources, (s) => s.sources);

  const ctx = setContext("scene", {
    label,
    sources,
    addSource,
    updateSource,
    updateSources,
  });

  return ctx;
};

export type SceneContext = ReturnType<typeof provideScene>;
