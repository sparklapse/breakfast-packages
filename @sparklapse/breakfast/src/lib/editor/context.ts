import { setContext } from "svelte";
import { derived, writable } from "svelte/store";
import { useScene } from "$lib/scene";

export const provideEditor = () => {
  const scene = useScene();
  if (!scene) throw Error("You must provide a scene before providing an editor");

  const selectedIds = writable({ selection: new Set<string>() });
  const selectedSource = derived([selectedIds, scene.sources], ([$ids, $sources]) => {
    if ($ids.selection.size !== 1) return;
    const id = $ids.selection.values().next().value as string;
    return $sources.get(id);
  });
  const dragging = writable<boolean>(false);
  const resizing = writable<"nw" | "ne" | "sw" | "se" | false>(false);
  const selecting = writable<boolean>(false);

  const ctx = setContext("editor", {
    scene,
    selected: {
      ids: selectedIds,
      individual: selectedSource,
    },
    dragging,
    resizing,
    selecting,
  });

  return ctx;
};

export type EditorContext = ReturnType<typeof provideEditor>;
