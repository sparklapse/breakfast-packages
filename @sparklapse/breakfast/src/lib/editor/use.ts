import { getContext } from "svelte";
import type { EditorContext } from "./context";

export const useEditor = () => getContext<EditorContext>("editor");
