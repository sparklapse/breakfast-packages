<script lang="ts">
  import type { ComponentType } from "svelte";

  export let data: Record<string, any>;
  export let transform: { x: number; y: number; width: number; height: number } = {
    x: 0,
    y: 0,
    width: 400,
    height: 300,
  };
  export let component: ComponentType | undefined;
</script>

<div
  class="source"
  style:left="{transform.x}px"
  style:top="{transform.y}px"
  style:width="{transform.width}px"
  style:height="{transform.height}px"
  data-breakfast-source
>
  <svelte:component this={component} {...data} />
  <slot />
</div>

<style>
  .source {
    position: absolute;
    isolation: isolate;
    user-select: none;
  }
</style>
