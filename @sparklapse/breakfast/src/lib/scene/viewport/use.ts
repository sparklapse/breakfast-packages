import { getContext } from "svelte";
import type { ViewportContext } from "./context";

export const useViewport = () => getContext<ViewportContext>("viewport");
