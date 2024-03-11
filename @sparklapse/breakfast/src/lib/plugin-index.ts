/**
 * These exports are for use within a breakfast plugin.
 */

import type { ComponentType } from "svelte";

export * from "./scene/use";
export * from "./editor/use";

export type ComponentProps<C extends ComponentType> = NonNullable<
  ConstructorParameters<C>[0]["props"]
>;
