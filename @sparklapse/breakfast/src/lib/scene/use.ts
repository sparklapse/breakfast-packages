import { getContext } from "svelte";
import type { SceneContext } from "./context";

export const useScene = () => getContext<SceneContext>("scene");
export * from "./viewport/use";
