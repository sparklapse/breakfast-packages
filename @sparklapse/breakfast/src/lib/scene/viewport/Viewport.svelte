<script lang="ts">
  import { onMount } from "svelte";
  import { provideViewport } from "./context";
  import { useViewport } from "./use";

  export let zoomMin = 0.25;
  export let zoomMax = 5;
  export let initialFocus: {
    x: number;
    y: number;
    width: number;
    height: number;
    padding?: number;
  } = {
    x: 1920 / 2,
    y: 1080 / 2,
    width: 1920,
    height: 1080,
    padding: 100,
  };

  let container: Element;
  const { transform, panTo, mount } =
    useViewport() ?? provideViewport({ min: zoomMin, max: zoomMax });

  let offset = { x: 0, y: 0 };

  onMount(() => {
    const unmount = mount(container);
    panTo(initialFocus);

    const observer = new ResizeObserver(() => {
      const { width, height } = container.getBoundingClientRect();
      offset = {
        x: -(width / 2),
        y: -(height / 2),
      };
    });

    observer.observe(container);

    return () => {
      unmount();
      observer.disconnect();
    };
  });
</script>

<div class="breakfast-container" bind:this={container}>
  <slot name="before" />
  <div
    class="breakfast-viewport"
    style:transform="translate({$transform.x}px, {$transform.y}px) scale({$transform.k})"
    style:translate="{offset.x}px {offset.y}px"
  >
    <slot />
  </div>
  <slot name="after" />
</div>

<style>
  .breakfast-container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .breakfast-viewport {
    position: absolute;
    left: 50%;
    top: 50%;
    isolation: isolate;
    width: 0;
    height: 0;
  }
</style>
